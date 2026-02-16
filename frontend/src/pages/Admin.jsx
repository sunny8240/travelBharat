import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import apiClient from "../services/api";
import { extractMapSrc } from "../utils/mapHelpers";
import IconSvg from "../component/IconSvg";

export default function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [states, setStates] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [destSearchInput, setDestSearchInput] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [filterStateId, setFilterStateId] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchStateQuery, setSearchStateQuery] = useState('');
  const [sortStateOrder, setSortStateOrder] = useState('newest');
  const [filterStateType, setFilterStateType] = useState('all');

  // Form
  const [newDestination, setNewDestination] = useState({
    name: "",
    city: "",
    state: "",
    category: "Heritage",
    description: "",
    historicalSignificance: "",
    bestTimeToVisit: "",
    entryFee: "",
    timings: "",
    images: "",
    mapLink: ""
  });

  const [newState, setNewState] = useState({
    name: "",
    type: "State",
    capital: "",
    description: "",
    bestTimeToVisit: "",
    images: "",
    mapLink: ""
  });

  const [editingState, setEditingState] = useState(null);
  
  const [editingDestination, setEditingDestination] = useState(null);
  const [showEditDestinationForm, setShowEditDestinationForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successType, setSuccessType] = useState(null); // 'destination' or 'state'
  const [successItemName, setSuccessItemName] = useState('');
  const [createdItem, setCreatedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "destinations" || activeTab === "manage-destinations" || activeTab === "manage-states") {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statesResponse = await apiClient.states.getAllAdmin({ limit: 100 });
      const destResponse = await apiClient.destinations.getAllAdmin({ limit: 100 });
      const statesArray = statesResponse.data || statesResponse || [];
      const destArray = destResponse.data || destResponse || [];
      setStates(Array.isArray(statesArray) ? statesArray : []);
      setDestinations(Array.isArray(destArray) ? destArray : []);
      setError(null);
    } catch (err) {
      const msg = (err && err.message) ? err.message : "Failed to load data";
      setError(msg);
      setStates([]);
      setDestinations([]);
      if (/401|Not authorized|Token is not valid|Invalid credentials/i.test(msg)) {
        try { logout(); } catch(e) {}
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Upload helpers
  const uploadFile = async (file) => {
    try {
      const data = await apiClient.uploads.uploadImage(file);
      return data.url;
    } catch (err) {
      setError(err.message || 'Upload failed');
      return null;
    }
  };

 
  const destFileInputRef = useRef(null);
  const stateFileInputRef = useRef(null);

  const [destSelectedFiles, setDestSelectedFiles] = useState([]);
  const [destPreviews, setDestPreviews] = useState([]);
  const [stateSelectedFiles, setStateSelectedFiles] = useState([]);
  const [statePreviews, setStatePreviews] = useState([]);

  const handleSelectFiles = (e, target = 'destination') => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (target === 'destination') {
      const newPreviews = files.map(f => ({ url: URL.createObjectURL(f), name: f.name }));
      setDestSelectedFiles(prev => [...prev, ...files]);
      setDestPreviews(prev => [...prev, ...newPreviews]);
    } else {
      const newPreviews = files.map(f => ({ url: URL.createObjectURL(f), name: f.name }));
      setStateSelectedFiles(prev => [...prev, ...files]);
      setStatePreviews(prev => [...prev, ...newPreviews]);
    }
    e.target.value = '';
  };

  const removeSelectedPreview = (index, target = 'destination') => {
    if (target === 'destination') {
      const removed = destPreviews[index];
      if (removed) URL.revokeObjectURL(removed.url);
      setDestPreviews(prev => prev.filter((_, i) => i !== index));
      setDestSelectedFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      const removed = statePreviews[index];
      if (removed) URL.revokeObjectURL(removed.url);
      setStatePreviews(prev => prev.filter((_, i) => i !== index));
      setStateSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const parseImageUrls = (str) => {
    if (!str) return [];
    return str.split(',').map(s => s.trim()).filter(Boolean);
  };

  const removeImageUrl = (url, target = 'destination') => {
    if (target === 'destination') {
      setNewDestination(prev => ({ ...prev, images: parseImageUrls(prev.images).filter(u => u !== url).join(', ') }));
    } else {
      setNewState(prev => ({ ...prev, images: parseImageUrls(prev.images).filter(u => u !== url).join(', ') }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCreateDestination = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uploadedUrls = [];
      for (const file of destSelectedFiles) {
        const u = await uploadFile(file);
        if (u) uploadedUrls.push(u);
      }

      const existingUrls = newDestination.images ? newDestination.images.split(",").map(img => img.trim()).filter(img => img) : [];
      const finalImages = [...existingUrls, ...uploadedUrls];

      const destData = {
        ...newDestination,
        state: newDestination.state,
        images: finalImages
      };

      const created = await apiClient.destinations.create(destData);
      setCreatedItem(created);
      setSuccessItemName(created?.name || newDestination.name);
      setSuccessType('destination');
      setShowSuccessModal(true);
      
      setNewDestination({
        name: "",
        city: "",
        state: "",
        category: "Heritage",
        description: "",
        historicalSignificance: "",
        bestTimeToVisit: "",
        entryFee: "",
        timings: "",
        images: "",
        mapLink: ""
      });
      setDestSelectedFiles([]);
      destPreviews.forEach(p => p.url && URL.revokeObjectURL(p.url));
      setDestPreviews([]);
      await fetchData();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to create destination");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateState = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const uploadedStateUrls = [];
      for (const file of stateSelectedFiles) {
        const u = await uploadFile(file);
        if (u) uploadedStateUrls.push(u);
      }
      const existingStateUrls = newState.images ? newState.images.split(",").map(img => img.trim()).filter(img => img) : [];
      const finalStateImages = [...existingStateUrls, ...uploadedStateUrls];

      const stateData = {
        ...newState,
        images: finalStateImages
      };

      const created = await apiClient.states.create(stateData);
      setCreatedItem(created);
      setSuccessItemName(created?.name || newState.name);
      setSuccessType('state');
      setShowSuccessModal(true);
      
      setNewState({
        name: "",
        type: "State",
        capital: "",
        description: "",
        bestTimeToVisit: "",
        images: "",
        mapLink: ""
      });
      setStateSelectedFiles([]);
      statePreviews.forEach(p => p.url && URL.revokeObjectURL(p.url));
      setStatePreviews([]);
      await fetchData();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to create state");
    } finally {
      setLoading(false);
    }
  };

  

  const handleDeleteDestination = async (destId) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      setLoading(true);
      await apiClient.destinations.delete(destId);
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to delete destination");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDestination = async (destId) => {
    try {
      setLoading(true);
      await apiClient.destinations.approve(destId);
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to approve destination");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveState = async (stateId) => {
    try {
      setLoading(true);
      await apiClient.states.approve(stateId);
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to approve state");
    } finally {
      setLoading(false);
    }
  };

  const handleEditDestination = (destination) => {
    setEditingDestination(destination);
    setNewDestination({
      name: destination.name || "",
      city: destination.city || "",
      state: destination.state?._id || destination.state || "",
      category: destination.category || "Heritage",
      description: destination.description || "",
      historicalSignificance: destination.historicalSignificance || "",
      bestTimeToVisit: destination.bestTimeToVisit || "",
      entryFee: destination.entryFee || "",
      timings: destination.timings || "",
      images: destination.images?.join(", ") || "",
      mapLink: destination.mapLink || ""
    });
    setShowEditDestinationForm(true);
    setActiveTab('manage-destinations');
  };

  const handleUpdateDestination = async (e) => {
    e.preventDefault();
    if (!editingDestination) return;
    try {
      setLoading(true);
      
      const uploadedUrls = [];
      for (const file of destSelectedFiles) {
        const u = await uploadFile(file);
        if (u) uploadedUrls.push(u);
      }

      const existingUrls = newDestination.images ? newDestination.images.split(",").map(img => img.trim()).filter(img => img) : [];
      const finalImages = [...existingUrls, ...uploadedUrls];

      const destData = {
        ...newDestination,
        state: newDestination.state,
        images: finalImages
      };
      
      await apiClient.destinations.update(editingDestination._id, destData);
      
      setEditingDestination(null);
      setShowEditDestinationForm(false);
      setNewDestination({
        name: "",
        city: "",
        state: "",
        category: "Heritage",
        description: "",
        historicalSignificance: "",
        bestTimeToVisit: "",
        entryFee: "",
        timings: "",
        images: "",
        mapLink: ""
      });
      setDestSelectedFiles([]);
      destPreviews.forEach(p => p.url && URL.revokeObjectURL(p.url));
      setDestPreviews([]);
      await fetchData();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update destination");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteState = async (stateId) => {
    if (!window.confirm("Are you sure you want to delete this state?")) return;
    try {
      setLoading(true);
      await apiClient.states.delete(stateId);
      await fetchData();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete state");
    } finally {
      setLoading(false);
    }
  };

  const handleEditState = (state) => {
    setEditingState(state);
    setNewState({
      name: state.name,
      type: state.type,
      capital: state.capital || "",
      description: state.description || "",
      bestTimeToVisit: state.bestTimeToVisit || "",
      images: state.images?.join(", ") || "",
      mapLink: state.mapLink || ""
    });
    setActiveTab('manage-states');
  };

  const handleUpdateState = async (e) => {
    e.preventDefault();
    if (!editingState) return;
    try {
      setLoading(true);
      
      const uploadedStateUrls = [];
      for (const file of stateSelectedFiles) {
        const u = await uploadFile(file);
        if (u) uploadedStateUrls.push(u);
      }

      const existingStateUrls = newState.images ? newState.images.split(",").map(img => img.trim()).filter(img => img) : [];
      const finalStateImages = [...existingStateUrls, ...uploadedStateUrls];

      const stateData = {
        ...newState,
        images: finalStateImages
      };
      
      await apiClient.states.update(editingState._id, stateData);
      
      setEditingState(null);
      setNewState({
        name: "",
        type: "State",
        capital: "",
        description: "",
        bestTimeToVisit: "",
        images: "",
        mapLink: ""
      });
      setStateSelectedFiles([]);
      statePreviews.forEach(p => p.url && URL.revokeObjectURL(p.url));
      setStatePreviews([]);
      await fetchData();
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to update state");
    } finally {
      setLoading(false);
    }
  };

  // Auto-dismiss toast when shown
  useEffect(() => {
    if (!showSuccessModal) return;
    const t = setTimeout(() => setShowSuccessModal(false), 4000);
    return () => clearTimeout(t);
  }, [showSuccessModal]);

  const tabStyle = {
    padding: "12px 20px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    color: "var(--muted)",
    borderBottom: "3px solid transparent",
    transition: "var(--transition)"
  };

  const activeTabStyle = {
    ...tabStyle,
    color: "var(--accent)",
    borderBottom: "3px solid var(--accent)"
  };

  return (
    <div style={{ paddingTop: "80px", background: "var(--paper)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
        color: "var(--paper)",
        padding: "clamp(24px, 6vw, 40px) clamp(16px, 6vw, 40px)",
        marginBottom: "clamp(24px, 6vw, 40px)"
      }}>
        <div style={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: "clamp(12px, 3vw, 20px)"
        }}>
          <div>
            <h1 style={{ 
              fontFamily: "var(--heading)", 
              fontSize: "clamp(1.5rem, 6vw, 2.5rem)", 
              marginBottom: "8px" 
            }}>
              Admin Dashboard
            </h1>
            <p style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", opacity: 0.9 }}>Welcome, {user?.name || user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)",
              background: "rgba(255, 255, 255, 0.2)",
              color: "var(--paper)",
              border: "2px solid var(--paper)",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "var(--transition)",
              fontSize: "clamp(0.85rem, 2vw, 1rem)"
            }}
            onMouseOver={(e) => e.target.style.background = "rgba(255, 255, 255, 0.3)"}
            onMouseOut={(e) => e.target.style.background = "rgba(255, 255, 255, 0.2)"}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 clamp(16px, 6vw, 40px)",
        borderBottom: "2px solid #e0e0e0",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch"
      }}>
          <div className="admin-tabs" style={{ display: "flex", gap: 0, minWidth: "max-content" }}>
          {["dashboard", "destinations", "manage-destinations", "manage-states", "analytics"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? { ...activeTabStyle, whiteSpace: "nowrap", fontSize: "clamp(0.85rem, 2vw, 1rem)", padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)" } : { ...tabStyle, whiteSpace: "nowrap", fontSize: "clamp(0.85rem, 2vw, 1rem)", padding: "clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px)" }}
            >
              {tab === "dashboard" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="20px" fill="#8B7DBE"><path d="M513.33-580v-260H840v260H513.33ZM120-446.67V-840h326.67v393.33H120ZM513.33-120v-393.33H840V-120H513.33ZM120-120v-260h326.67v260H120Z"/></svg> Dashboard</span>}
              {tab === "destinations" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#EA3323"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z"/></svg> Manage</span>}
              {tab === "manage-destinations" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="25px" fill="#0000F5"><path d="M446.67-120v-326.67H120v-66.66h326.67V-840h66.66v326.67H840v66.66H513.33V-120h-66.66Z"/></svg> Create Destination</span>}
              {tab === "states" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="20px" fill="#4CAF50"><path d="m608-120-255.33-90-181.34 71.33q-18 8.67-34.66-2.16Q120-151.67 120-172v-558.67q0-13 7.5-23t19.83-15L352.67-840 608-750.67 788.67-822q18-8 34.66 2.5Q840-809 840-788.67v563.34q0 11.66-7.5 20.33-7.5 8.67-19.17 13L608-120Zm-36-82.67v-492.66L388-758v492.67l184 62.66Z"/></svg> Manage States</span>}
              {tab === "manage-states" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="30px" fill="#75FB4C"><path d="M446.67-446.67H200v-66.66h246.67V-760h66.66v246.67H760v66.66H513.33V-200h-66.66v-246.67Z"/></svg> Create State</span>}
              {tab === "analytics" && <span style={{ display: "flex", alignItems: "center", gap: "8px" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="20px" fill="#BB271A"><path d="M120-120v-77.33L186.67-264v144H120Zm163.33 0v-237.33L350-424v304h-66.67Zm163.34 0v-304l66.66 67.67V-120h-66.66ZM610-120v-236.33L676.67-423v303H610Zm163.33 0v-397.33L840-584v464h-66.67ZM120-346.33v-94.34l280-278.66 160 160L840-840v94.33L560-465 400-625 120-346.33Z"/></svg> Analytics</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "clamp(20px, 6vw, 40px) clamp(12px, 4vw, 40px)" }}>
        {error && (
          <div style={{
            background: "#fee",
            border: "1px solid #fcc",
            color: "#c33",
            padding: "clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px)",
            borderRadius: "6px",
            marginBottom: "20px",
            fontSize: "clamp(0.85rem, 2vw, 1rem)"
          }}>
            {error}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.5rem, 5vw, 2rem)", marginBottom: "clamp(16px, 4vw, 24px)", color: "var(--dark)" }}>
              Dashboard Overview
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(clamp(150px, 40vw, 250px), 1fr))",
              gap: "clamp(12px, 3vw, 20px)",
              marginBottom: "clamp(24px, 6vw, 40px)"
            }}>
              {[
                { label: "Total States", value: states.length, icon: <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#5985E1"><path d="m608-120-255.33-90-181.34 71.33q-18 8.67-34.66-2.16Q120-151.67 120-172v-558.67q0-13 7.5-23t19.83-15L352.67-840 608-750.67 788.67-822q18-8 34.66 2.5Q840-809 840-788.67v563.34q0 11.66-7.5 20.33-7.5 8.67-19.17 13L608-120Zm-36-82.67v-492.66L388-758v492.67l184 62.66Z"/></svg></span> },
                { label: "Total Destinations", value: destinations.length, icon: <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#BB271A"><path d="M446.67-406.67h66.66v-108h120v-66.66h-120v-108h-66.66v108H336v66.66h120v108ZM480-80Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z"/></svg></span> },
                { label: "Published", value: (destinations.filter(d => d.isApproved).length + states.filter(s => s.isApproved).length), icon: <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#78A75A"><path d="M433.33-82Q360-90.67 296.5-124.5q-63.5-33.83-110-86.67Q140-264 113.33-332.67 86.67-401.33 86.67-480q0-89 39.83-168T234-786.67H120.67v-66.66h232.66v232.66h-66.66V-743q-61 48.67-97.17 117.17T153.33-480q0 129 80.17 221.17 80.17 92.16 199.83 109.16V-82ZM423-305.33l-159.67-160L310-512l113 113 227-227 46.67 47L423-305.33Zm183.67 198.66v-232.66h66.66V-217q61-49.67 97.17-117.67T806.67-480q0-129-80.17-221.17-80.17-92.16-199.83-109.16V-878q148 17 247.33 128.67Q873.33-637.67 873.33-480q0 89-39.83 168T726-173.33h113.33v66.66H606.67Z"/></svg></span> },
                { label: "Pending", value: (destinations.filter(d => !d.isApproved).length + states.filter(s => !s.isApproved).length), icon: <span style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#EAC452"><path d="M308.5-442.25q15.5-15.57 15.5-37.83 0-22.25-15.58-37.75t-37.83-15.5q-22.26 0-37.76 15.58-15.5 15.57-15.5 37.83 0 22.25 15.58 37.75t37.83 15.5q22.26 0 37.76-15.58Zm209.33 0q15.5-15.57 15.5-37.83 0-22.25-15.58-37.75-15.57-15.5-37.83-15.5-22.25 0-37.75 15.58-15.5 15.57-15.5 37.83 0 22.25 15.58 37.75 15.57 15.5 37.83 15.5 22.25 0 37.75-15.58Zm208.67 0q15.5-15.57 15.5-37.83 0-22.25-15.58-37.75t-37.83-15.5q-22.26 0-37.76 15.58-15.5 15.57-15.5 37.83 0 22.25 15.58 37.75t37.84 15.5q22.25 0 37.75-15.58ZM480.18-80q-82.83 0-155.67-31.5-72.84-31.5-127.18-85.83Q143-251.67 111.5-324.56T80-480.33q0-82.88 31.5-155.78Q143-709 197.33-763q54.34-54 127.23-85.5T480.33-880q82.88 0 155.78 31.5Q709-817 763-763t85.5 127Q880-563 880-480.18q0 82.83-31.5 155.67Q817-251.67 763-197.46q-54 54.21-127 85.84Q563-80 480.18-80Z"/></svg></span> }
              ].map((stat, i) => (
                <div key={i} style={{
                  background: "white",
                  padding: "clamp(16px, 3vw, 24px)",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: "12px" }}>{stat.icon}</div>
                  <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: "bold", color: "var(--accent)", marginBottom: "8px" }}>
                    {stat.value}
                  </div>
                  <div style={{ color: "var(--muted)", fontWeight: "500", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h3 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.2rem, 4vw, 1.5rem)", marginBottom: "clamp(12px, 3vw, 16px)", color: "var(--dark)" }}>
              Quick Actions
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(140px, 40vw, 200px), 1fr))", gap: "clamp(10px, 2vw, 16px)" }}>
              {[
                { 
                  label: "Create Destination", 
                  tab: "manage-destinations", 
                  iconColor: "#EA3323"
                },
                { 
                  label: "View Destinations", 
                  tab: "destinations", 
                  iconColor: "#5985E1"
                },
                { 
                  label: "View Analytics", 
                  tab: "analytics", 
                  iconColor: "#EA33F7"
                }
              ].map((action, i) => {
                const isHovered = hoveredButton === i;
                const currentFill = isHovered ? "white" : action.iconColor;
                
                let svgIcon;
                if (i === 0) {
                  svgIcon = <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill={currentFill}><path d="M444-408h72v-108h108v-72H516v-108h-72v108H336v72h108v108Zm36 312Q323.03-227.11 245.51-339.55 168-452 168-549q0-134 89-224.5T479.5-864q133.5 0 223 90.5T792-549q0 97-77 209T480-96Z"/></svg>;
                } else if (i === 1) {
                  svgIcon = <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill={currentFill}><path d="M216-552q-33 0-52.5-19.5T144-624v-120q0-33 19.5-52.5T216-816h120q33 0 52.5 19.5T408-744v120q0 33-19.5 52.5T336-552H216Zm0 408q-33 0-52.5-19.5T144-216v-120q0-33 19.5-52.5T216-408h120q33 0 52.5 19.5T408-336v120q0 33-19.5 52.5T336-144H216Zm408-408q-33 0-52.5-19.5T552-624v-120q0-33 19.5-52.5T624-816h120q33 0 52.5 19.5T816-744v120q0 33-19.5 52.5T744-552H624Zm0 408q-33 0-52.5-19.5T552-216v-120q0-33 19.5-52.5T624-408h120q33 0 52.5 19.5T816-336v120q0 33-19.5 52.5T744-144H624Z"/></svg>;
                } else {
                  svgIcon = <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill={currentFill}><path d="m147-209-51-51 281-281 152 152 212-211H624v-72h240v240h-72v-117L529-287 377-439 147-209Z"/></svg>;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setActiveTab(action.tab)}
                    style={{
                      padding: "clamp(12px, 2vw, 16px) clamp(12px, 3vw, 20px)",
                      background: isHovered ? "var(--accent)" : "white",
                      border: "2px solid var(--accent)",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "clamp(0.8rem, 2vw, 1rem)",
                      fontWeight: "600",
                      color: isHovered ? "white" : "var(--accent)",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "clamp(6px, 2vw, 8px)",
                      flexDirection: window.innerWidth < 480 ? "column" : "row"
                    }}
                    onMouseEnter={() => setHoveredButton(i)}
                    onMouseLeave={() => setHoveredButton(null)}
                  >
                    <span style={{ display: "flex", alignItems: "center", fontSize: "clamp(1rem, 3vw, 1.2rem)" }}>
                      {svgIcon}
                    </span>
                    {action.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Destinations Tab */}
        {activeTab === "destinations" && (
          <div>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.5rem, 5vw, 2rem)", marginBottom: "clamp(12px, 3vw, 12px)", color: "var(--dark)" }}>
              Manage
            </h2>

            {loading && <p>Loading destinations...</p>}
            {/* Filter & Search */}
            <div style={{ display: 'flex', gap: 'clamp(8px, 2vw, 12px)', marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="search"
                placeholder="Search destinations..."
                value={destSearchInput}
                onChange={(e) => setDestSearchInput(e.target.value)}
                style={{ padding: 'clamp(8px, 2vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, border: '1px solid #ddd', minWidth: 'clamp(120px, 40vw, 240px)', fontSize: "clamp(0.85rem, 2vw, 1rem)" }}
                onKeyDown={(e) => { if (e.key === 'Enter') setSearchQuery(destSearchInput); }}
              />

              <button onClick={() => setSearchQuery(destSearchInput)} style={{ padding: 'clamp(8px, 2vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, border: '1px solid var(--accent)', background: 'var(--accent)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: "clamp(0.85rem, 2vw, 1rem)", whiteSpace: 'nowrap' }}>Search</button>

              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ padding: 'clamp(8px, 2vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, border: '1px solid #ddd', fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

              <select value={filterStateId} onChange={(e) => setFilterStateId(e.target.value)} style={{ padding: 'clamp(8px, 2vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, border: '1px solid #ddd', fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                <option value="all">All States</option>
                {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>

              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: 'clamp(8px, 2vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, border: '1px solid #ddd', fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                <option value="all">All Categories</option>
                {Array.from(new Set(destinations.map(d => d.category).filter(Boolean))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <button onClick={() => { setSearchQuery(''); setDestSearchInput(''); setFilterStateId('all'); setFilterCategory('all'); setSortOrder('newest'); }} style={{ padding: 'clamp(8px, 2vw, 10px) clamp(8px, 2vw, 12px)', borderRadius: 6, border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer', fontSize: "clamp(0.85rem, 2vw, 1rem)", whiteSpace: 'nowrap' }}>Clear</button>
            </div>

            {/* Prepare filtered list */}
            {(() => {
              const q = searchQuery.trim().toLowerCase();
              let list = destinations.slice();
              if (q) {
                list = list.filter(d => (d.name || '').toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q));
              }
              if (filterStateId !== 'all') list = list.filter(d => String(d.state?._id) === String(filterStateId));
              if (filterCategory !== 'all') list = list.filter(d => d.category === filterCategory);
              list.sort((a,b) => {
                const ta = new Date(a.createdAt || a._id); const tb = new Date(b.createdAt || b._id);
                return sortOrder === 'newest' ? tb - ta : ta - tb;
              });
              const filteredDestinations = list;
              return (
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    fontSize: "clamp(0.8rem, 2vw, 1rem)"
                  }}>
                    <thead>
                      <tr style={{ background: "var(--paper)" }}>
                        <th style={{ padding: "clamp(10px, 2vw, 16px)", textAlign: "left", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>Name</th>
                        <th style={{ padding: "clamp(10px, 2vw, 16px)", textAlign: "left", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>State</th>
                        <th style={{ padding: "clamp(10px, 2vw, 16px)", textAlign: "left", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>Category</th>
                        <th style={{ padding: "clamp(10px, 2vw, 16px)", textAlign: "left", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>Status</th>
                        <th style={{ padding: "clamp(10px, 2vw, 16px)", textAlign: "center", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDestinations.length > 0 ? (
                        filteredDestinations.map(dest => (
                          <tr key={dest._id} style={{ borderTop: "1px solid #e0e0e0" }}>
                            <td style={{ padding: "clamp(10px, 2vw, 16px)", color: "var(--dark)", fontWeight: "500", fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>{dest.name}</td>
                            <td style={{ padding: "clamp(10px, 2vw, 16px)", color: "var(--muted)", fontSize: "clamp(0.75rem, 2vw, 1rem)" }}>{dest.state?.name || "N/A"}</td>
                            <td style={{ padding: "clamp(10px, 2vw, 16px)", color: "var(--muted)", fontSize: "clamp(0.75rem, 2vw, 1rem)" }}>{dest.category}</td>
                            <td style={{ padding: "clamp(10px, 2vw, 16px)" }}>
                              <span style={{
                                display: "inline-block",
                                padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
                                borderRadius: "20px",
                                fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                                fontWeight: "600",
                                background: dest.isApproved ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 152, 0, 0.1)",
                                color: dest.isApproved ? "#4caf50" : "#ff9800"
                              }}>
                                {dest.isApproved ? "Published" : "Pending"}
                              </span>
                            </td>
                            <td style={{ padding: "clamp(10px, 2vw, 16px)", textAlign: "center" }}>
                              {!dest.isApproved && (
                                <button
                                  onClick={() => handleApproveDestination(dest._id)}
                                  style={{
                                    padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
                                    marginRight: "clamp(4px, 1vw, 8px)",
                                    background: "#4caf50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                                    fontWeight: "600"
                                  }}
                                >
                                  Publish
                                </button>
                              )}
                              <button
                                onClick={() => handleEditDestination(dest)}
                                style={{
                                  padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
                                  marginRight: "clamp(4px, 1vw, 8px)",
                                  background: "#2196F3",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                                  fontWeight: "600"
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteDestination(dest._id)}
                                style={{
                                  padding: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
                                  background: "#f44336",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "clamp(0.7rem, 1.5vw, 0.85rem)",
                                  fontWeight: "600"
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ padding: 'clamp(12px, 3vw, 20px)', textAlign: 'center', color: '#666', fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                            No destinations match the filters. Add one using the Create Destination form above.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })()}
                  {/* States quick table inside Manage */}
                  <div style={{ marginTop: 32 }}>
                    <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.25rem", marginBottom: "12px", color: "var(--dark)" }}>States</h3>
                    {(() => {
                      const q = searchStateQuery.trim().toLowerCase();
                      let list = states.slice();
                      if (q) {
                        list = list.filter(s => (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q));
                      }
                      if (filterStateType !== 'all') list = list.filter(s => s.type === filterStateType);
                      list.sort((a, b) => {
                        const ta = new Date(a.createdAt || a._id); const tb = new Date(b.createdAt || b._id);
                        return sortStateOrder === 'newest' ? tb - ta : ta - tb;
                      });
                      const filteredStates = list;
                      return (
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                            <thead>
                              <tr style={{ background: "var(--paper)" }}>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Name</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Type</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Capital</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Best Time</th>
                                <th style={{ padding: "12px", textAlign: "left", fontWeight: "600" }}>Status</th>
                                <th style={{ padding: "12px", textAlign: "center", fontWeight: "600" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredStates.length > 0 ? (
                                filteredStates.map(state => (
                                  <tr key={state._id} style={{ borderTop: "1px solid #e0e0e0" }}>
                                    <td style={{ padding: "12px", color: "var(--dark)", fontWeight: "500" }}>{state.name}</td>
                                    <td style={{ padding: "12px", color: "var(--muted)" }}>{state.type}</td>
                                    <td style={{ padding: "12px", color: "var(--muted)" }}>{state.capital || "N/A"}</td>
                                    <td style={{ padding: "12px", color: "var(--muted)" }}>{state.bestTimeToVisit || "N/A"}</td>
                                    <td style={{ padding: "12px" }}>
                                      <span style={{ display: "inline-block", padding: "6px 12px", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600", background: state.isApproved ? "rgba(76, 175, 80, 0.1)" : "rgba(255, 152, 0, 0.1)", color: state.isApproved ? "#4caf50" : "#ff9800" }}>
                                        {state.isApproved ? "Published" : "Pending"}
                                      </span>
                                    </td>
                                    <td style={{ padding: "12px", textAlign: "center" }}>
                                      {!state.isApproved && (
                                        <button onClick={() => handleApproveState(state._id)} style={{ padding: "6px 12px", marginRight: "8px", background: "#4caf50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}>Publish</button>
                                      )}
                                      <button onClick={() => { handleEditState(state); }} style={{ padding: "6px 12px", marginRight: "8px", background: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}>Edit</button>
                                      <button onClick={() => handleDeleteState(state._id)} style={{ padding: "6px 12px", background: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600" }}>Delete</button>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: '#666' }}>No states found.</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
          </div>
        )}

        {/* Create Destination Tab */}
        {activeTab === "manage-destinations" && (
          <div>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.5rem, 5vw, 2rem)", marginBottom: "clamp(16px, 4vw, 24px)", color: "var(--dark)" }}>
              Create New Destination
            </h2>

            <form onSubmit={handleCreateDestination} className="admin-form">
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(clamp(140px, 40vw, 250px), 1fr))",
                gap: "clamp(16px, 3vw, 24px)",
                marginBottom: "clamp(16px, 3vw, 24px)"
              }}>
                {/* Name */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                    Destination Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDestination.name}
                    onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                    placeholder="e.g., Taj Mahal"
                    style={{
                      width: "100%",
                      padding: "clamp(8px, 2vw, 12px)",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)"
                    }}
                  />
                </div>

                {/* City */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDestination.city}
                    onChange={(e) => setNewDestination({ ...newDestination, city: e.target.value })}
                    placeholder="e.g., Agra"
                    style={{
                      width: "100%",
                      padding: "clamp(8px, 2vw, 12px)",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)"
                    }}
                  />
                </div>

                {/* State */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                    State *
                  </label>
                  <select
                    required
                    value={newDestination.state}
                    onChange={(e) => setNewDestination({ ...newDestination, state: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "clamp(8px, 2vw, 12px)",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)"
                    }}
                  >
                    <option value="">Select a state</option>
                    {states.map(state => (
                      <option key={state._id} value={state._id}>{state.name}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                    Category *
                  </label>
                  <select
                    value={newDestination.category}
                    onChange={(e) => setNewDestination({ ...newDestination, category: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "clamp(8px, 2vw, 12px)",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)"
                    }}
                  >
                    <option value="Heritage">Heritage</option>
                    <option value="Nature">Nature</option>
                    <option value="Religious">Religious</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Beach">Beach</option>
                    <option value="Hill Station">Hill Station</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                  Description *
                </label>
                <textarea
                  required
                  value={newDestination.description}
                  onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                  placeholder="Describe the destination..."
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "clamp(8px, 2vw, 12px)",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Historical Significance */}
              <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                  Historical Significance
                </label>
                <textarea
                  value={newDestination.historicalSignificance}
                  onChange={(e) => setNewDestination({ ...newDestination, historicalSignificance: e.target.value })}
                  placeholder="Share historical details..."
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "clamp(8px, 2vw, 12px)",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    fontFamily: "inherit"
                  }}
                />
              </div>

              {/* Other Details Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(clamp(120px, 40vw, 200px), 1fr))",
                gap: "clamp(16px, 3vw, 24px)",
                marginBottom: "clamp(16px, 3vw, 24px)"
              }}>
                {/* Best Time to Visit */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                    Best Time to Visit
                  </label>
                  <input
                    type="text"
                    value={newDestination.bestTimeToVisit}
                    onChange={(e) => setNewDestination({ ...newDestination, bestTimeToVisit: e.target.value })}
                    placeholder="e.g., October - March"
                    style={{
                      width: "100%",
                      padding: "clamp(8px, 2vw, 12px)",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)"
                    }}
                  />
                </div>

                {/* Entry Fee */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                    Entry Fee
                  </label>
                  <input
                    type="text"
                    value={newDestination.entryFee}
                    onChange={(e) => setNewDestination({ ...newDestination, entryFee: e.target.value })}
                    placeholder="e.g., ₹75"
                    style={{
                      width: "100%",
                      padding: "clamp(8px, 2vw, 12px)",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)"
                    }}
                  />
                </div>

                {/* Timings */}
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                    Timings
                  </label>
                  <input
                    type="text"
                    value={newDestination.timings}
                    onChange={(e) => setNewDestination({ ...newDestination, timings: e.target.value })}
                    placeholder="e.g., 6am - 9pm"
                    style={{
                      width: "100%",
                      padding: "clamp(8px, 2vw, 12px)",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      fontSize: "clamp(0.9rem, 2vw, 1rem)"
                    }}
                  />
                </div>
              </div>

              {/* Images */}
              <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                  Images (comma-separated URLs)
                </label>
                <textarea
                  value={newDestination.images}
                  onChange={(e) => setNewDestination({ ...newDestination, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  rows="3"
                  style={{
                    width: "100%",
                    padding: "clamp(8px, 2vw, 12px)",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    fontFamily: "inherit"
                  }}
                />
                  <div style={{ marginTop: 8 }}>
                    <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: 'var(--dark)', fontSize: '0.9rem' }}>Or upload image</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => destFileInputRef && destFileInputRef.current && destFileInputRef.current.click()}
                        disabled={loading}
                        style={{ padding: '8px 12px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                      >
                        {loading ? 'Uploading...' : 'Upload Image'}
                      </button>
                      <input ref={destFileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleSelectFiles(e, 'destination')} />
                    </div>

                    {/* Previews: selected (local) then existing (uploaded URLs) */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      {destPreviews.map((p, idx) => (
                        <div key={`local-${idx}`} style={{ position: 'relative' }}>
                          <img src={p.url} alt={p.name} style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} onError={(e) => { e.target.src = '/error.svg'; }} />
                          <button onClick={() => removeSelectedPreview(idx, 'destination')} type="button" style={{ position: 'absolute', top: -8, right: -8, background: '#f44336', color: 'white', border: 'none', borderRadius: 12, width: 24, height: 24, cursor: 'pointer' }}>×</button>
                        </div>
                      ))}

                      {parseImageUrls(newDestination.images).map((u) => (
                        <div key={u} style={{ position: 'relative' }}>
                          <img src={u} alt="preview" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} onError={(e) => { e.target.src = '/error.svg'; }} />
                          <button onClick={() => removeImageUrl(u, 'destination')} type="button" style={{ position: 'absolute', top: -8, right: -8, background: '#f44336', color: 'white', border: 'none', borderRadius: 12, width: 24, height: 24, cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>

              {/* Map Embed */}
              <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
                  Map Embed (paste iframe tag or src URL)
                </label>
                <textarea
                  value={newDestination.mapLink}
                  onChange={(e) => setNewDestination({ ...newDestination, mapLink: e.target.value })}
                  placeholder="Paste Google Maps embed iframe or the src URL here"
                  rows="2"
                  style={{
                    width: "100%",
                    padding: "clamp(8px, 2vw, 12px)",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "clamp(0.9rem, 2vw, 1rem)",
                    fontFamily: "inherit"
                  }}
                />

                {/* Preview */}
                {extractMapSrc(newDestination.mapLink) && (
                    <div className="responsive-iframe">
                      <iframe
                        title="map-preview"
                        src={extractMapSrc(newDestination.mapLink)}
                        loading="lazy"
                      />
                    </div>
                  )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "clamp(10px, 2vw, 12px) clamp(24px, 6vw, 32px)",
                  background: "var(--accent)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "clamp(0.9rem, 2vw, 1rem)",
                  fontWeight: "600",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                  transition: "var(--transition)"
                }}
              >
                {loading ? "Creating..." : "Create Destination"}
              </button>
            </form>

            {/* Destination Form - Modal Style */}
            {showEditDestinationForm && editingDestination && (
              <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000
              }}>
                <div style={{
                  background: "white",
                  padding: "40px",
                  borderRadius: "8px",
                  maxWidth: "600px",
                  maxHeight: "90vh",
                  overflowY: "auto",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
                }}>
                  <h2 style={{ fontFamily: "var(--heading)", fontSize: "1.8rem", marginBottom: "24px", color: "var(--dark)" }}>
                    Edit Destination
                  </h2>

                  <form onSubmit={handleUpdateDestination} className="admin-form">
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "24px",
                      marginBottom: "24px"
                    }}>
                      {/* Name */}
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                          Destination Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newDestination.name}
                          onChange={(e) => setNewDestination({ ...newDestination, name: e.target.value })}
                          placeholder="e.g., Taj Mahal"
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "1rem"
                          }}
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={newDestination.city}
                          onChange={(e) => setNewDestination({ ...newDestination, city: e.target.value })}
                          placeholder="e.g., Agra"
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "1rem"
                          }}
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                          State *
                        </label>
                        <select
                          required
                          value={newDestination.state}
                          onChange={(e) => setNewDestination({ ...newDestination, state: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "1rem"
                          }}
                        >
                          <option value="">Select a state</option>
                          {states.map(state => (
                            <option key={state._id} value={state._id}>{state.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                          Category *
                        </label>
                        <select
                          value={newDestination.category}
                          onChange={(e) => setNewDestination({ ...newDestination, category: e.target.value })}
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "1rem"
                          }}
                        >
                          <option value="Heritage">Heritage</option>
                          <option value="Nature">Nature</option>
                          <option value="Religious">Religious</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Beach">Beach</option>
                          <option value="Hill Station">Hill Station</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: "24px" }}>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                        Description *
                      </label>
                      <textarea
                        required
                        value={newDestination.description}
                        onChange={(e) => setNewDestination({ ...newDestination, description: e.target.value })}
                        placeholder="Describe the destination..."
                        rows="4"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          fontSize: "1rem",
                          fontFamily: "inherit"
                        }}
                      />
                    </div>

                    {/* Other Details Grid */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "24px",
                      marginBottom: "24px"
                    }}>
                      {/* Best Time to Visit */}
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                          Best Time to Visit
                        </label>
                        <input
                          type="text"
                          value={newDestination.bestTimeToVisit}
                          onChange={(e) => setNewDestination({ ...newDestination, bestTimeToVisit: e.target.value })}
                          placeholder="e.g., October - March"
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "1rem"
                          }}
                        />
                      </div>

                      {/* Entry Fee */}
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                          Entry Fee
                        </label>
                        <input
                          type="text"
                          value={newDestination.entryFee}
                          onChange={(e) => setNewDestination({ ...newDestination, entryFee: e.target.value })}
                          placeholder="e.g., ₹75"
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "1rem"
                          }}
                        />
                      </div>

                      {/* Timings */}
                      <div>
                        <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                          Timings
                        </label>
                        <input
                          type="text"
                          value={newDestination.timings}
                          onChange={(e) => setNewDestination({ ...newDestination, timings: e.target.value })}
                          placeholder="e.g., 6am - 9pm"
                          style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            fontSize: "1rem"
                          }}
                        />
                      </div>
                    </div>

                    {/* Images */}
                    <div style={{ marginBottom: "24px" }}>
                      <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)" }}>
                        Images (comma-separated URLs)
                      </label>
                      <textarea
                        value={newDestination.images}
                        onChange={(e) => setNewDestination({ ...newDestination, images: e.target.value })}
                        placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                        rows="2"
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid #ddd",
                          borderRadius: "6px",
                          fontSize: "1rem",
                          fontFamily: "inherit"
                        }}
                      />
                      <div style={{ marginTop: 8 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: 'var(--dark)', fontSize: '0.9rem' }}>Or upload image</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={() => destFileInputRef && destFileInputRef.current && destFileInputRef.current.click()}
                            disabled={loading}
                            style={{ padding: '8px 12px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                          >
                            {loading ? 'Uploading...' : 'Upload Image'}
                          </button>
                          <input ref={destFileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleSelectFiles(e, 'destination')} />
                        </div>

                        {/* Image Previews */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                          {destPreviews.map((p, idx) => (
                            <div key={`local-${idx}`} style={{ position: 'relative' }}>
                              <img src={p.url} alt={p.name} style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} onError={(e) => { e.target.src = '/error.svg'; }} />
                              <button onClick={() => removeSelectedPreview(idx, 'destination')} type="button" style={{ position: 'absolute', top: -8, right: -8, background: '#f44336', color: 'white', border: 'none', borderRadius: 12, width: 24, height: 24, cursor: 'pointer' }}>×</button>
                            </div>
                          ))}

                          {parseImageUrls(newDestination.images).map((u) => (
                            <div key={u} style={{ position: 'relative' }}>
                              <img src={u} alt="preview" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} onError={(e) => { e.target.src = '/error.svg'; }} />
                              <button onClick={() => removeImageUrl(u, 'destination')} type="button" style={{ position: 'absolute', top: -8, right: -8, background: '#f44336', color: 'white', border: 'none', borderRadius: 12, width: 24, height: 24, cursor: 'pointer' }}>×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Button Group */}
                    <div style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent: "flex-end"
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditDestinationForm(false);
                          setEditingDestination(null);
                          setNewDestination({
                            name: "",
                            city: "",
                            state: "",
                            category: "Heritage",
                            description: "",
                            historicalSignificance: "",
                            bestTimeToVisit: "",
                            entryFee: "",
                            timings: "",
                            images: "",
                            mapLink: ""
                          });
                          setDestSelectedFiles([]);
                          destPreviews.forEach(p => p.url && URL.revokeObjectURL(p.url));
                          setDestPreviews([]);
                        }}
                        style={{
                          padding: "12px 24px",
                          background: "#e0e0e0",
                          color: "var(--dark)",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "1rem",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "var(--transition)"
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        style={{
                          padding: "12px 24px",
                          background: "var(--accent)",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "1rem",
                          fontWeight: "600",
                          cursor: loading ? "not-allowed" : "pointer",
                          opacity: loading ? 0.6 : 1,
                          transition: "var(--transition)"
                        }}
                      >
                        {loading ? "Updating..." : "Update Destination"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Manage States Tab */}
        {activeTab === "states" && (
          <div>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "2rem", marginBottom: "24px", color: "var(--dark)" }}>
              Manage States
            </h2>

            {loading && <p>Loading states...</p>}
            {/* Filter & Search */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="search"
                placeholder="Search states..."
                value={searchStateQuery}
                onChange={(e) => setSearchStateQuery(e.target.value)}
                style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd', minWidth: 240 }}
              />

              <select value={sortStateOrder} onChange={(e) => setSortStateOrder(e.target.value)} style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd' }}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>

              <select value={filterStateType} onChange={(e) => setFilterStateType(e.target.value)} style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd' }}>
                <option value="all">All Types</option>
                <option value="State">State</option>
                <option value="Union Territory">Union Territory</option>
              </select>

              <button onClick={() => { setSearchStateQuery(''); setFilterStateType('all'); setSortStateOrder('newest'); }} style={{ padding: '10px 12px', borderRadius: 6, border: '1px solid #ddd', background: '#f5f5f5', cursor: 'pointer' }}>Clear</button>
            </div>

            {/* States Table */}
            {(() => {
              const q = searchStateQuery.trim().toLowerCase();
              let list = states.slice();
              if (q) {
                list = list.filter(s => (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q));
              }
              if (filterStateType !== 'all') list = list.filter(s => s.type === filterStateType);
              list.sort((a, b) => {
                const ta = new Date(a.createdAt || a._id); const tb = new Date(b.createdAt || b._id);
                return sortStateOrder === 'newest' ? tb - ta : ta - tb;
              });
              const filteredStates = list;
              return (
                <div style={{ overflowX: "auto" }}>
                  <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "white",
                    borderRadius: "8px",
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    <thead>
                      <tr style={{ background: "var(--paper)" }}>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>Name</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>Type</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>Capital</th>
                        <th style={{ padding: "16px", textAlign: "left", fontWeight: "600", color: "var(--dark)" }}>Best Time</th>
                        <th style={{ padding: "16px", textAlign: "center", fontWeight: "600", color: "var(--dark)" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStates.length > 0 ? (
                        filteredStates.map(state => (
                          <tr key={state._id} style={{ borderTop: "1px solid #e0e0e0" }}>
                            <td style={{ padding: "16px", color: "var(--dark)", fontWeight: "500" }}>{state.name}</td>
                            <td style={{ padding: "16px", color: "var(--muted)" }}>{state.type}</td>
                            <td style={{ padding: "16px", color: "var(--muted)" }}>{state.capital || "N/A"}</td>
                            <td style={{ padding: "16px", color: "var(--muted)" }}>{state.bestTimeToVisit || "N/A"}</td>
                            <td style={{ padding: "16px", textAlign: "center" }}>
                              <button
                                onClick={() => handleEditState(state)}
                                style={{
                                  padding: "6px 12px",
                                  marginRight: "8px",
                                  background: "#2196F3",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                  fontWeight: "600"
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteState(state._id)}
                                style={{
                                  padding: "6px 12px",
                                  background: "#f44336",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "4px",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                  fontWeight: "600"
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                            No states match the filters. Add one using the Create State form.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              );
            })()}
          </div>
        )}

        {/* Create State Tab */}
        {activeTab === "manage-states" && (
          <div>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.5rem, 5vw, 2rem)", marginBottom: "clamp(16px, 4vw, 24px)", color: "var(--dark)" }}>
              {editingState ? "Edit State" : "Create New State"}
            </h2>

            {/* Add/Edit Form */}
            <form onSubmit={editingState ? handleUpdateState : handleCreateState} className="admin-form" style={{ marginBottom: "40px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(140px, 40vw, 250px), 1fr))", gap: "clamp(16px, 3vw, 24px)", marginBottom: "clamp(16px, 3vw, 24px)" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>State Name *</label>
                  <input
                    required
                    value={newState.name}
                    onChange={(e) => setNewState({ ...newState, name: e.target.value })}
                    placeholder="e.g., Uttar Pradesh"
                    style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>Capital</label>
                  <input
                    value={newState.capital}
                    onChange={(e) => setNewState({ ...newState, capital: e.target.value })}
                    placeholder="e.g., Lucknow"
                    style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>Type</label>
                  <select
                    value={newState.type}
                    onChange={(e) => setNewState({ ...newState, type: e.target.value })}
                    style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                  >
                    <option value="State">State</option>
                    <option value="Union Territory">Union Territory</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>Best Time to Visit</label>
                  <input
                    value={newState.bestTimeToVisit}
                    onChange={(e) => setNewState({ ...newState, bestTimeToVisit: e.target.value })}
                    placeholder="e.g., October to March"
                    style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)" }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>Description</label>
                <textarea
                  value={newState.description}
                  onChange={(e) => setNewState({ ...newState, description: e.target.value })}
                  rows="4"
                  style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>Images (comma-separated URLs)</label>
                <textarea
                  value={newState.images}
                  onChange={(e) => setNewState({ ...newState, images: e.target.value })}
                  rows="3"
                  style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)", fontFamily: "inherit" }}
                />
                <div style={{ marginTop: 8 }}>
                  <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: 'var(--dark)', fontSize: '0.9rem' }}>Or upload image</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => stateFileInputRef && stateFileInputRef.current && stateFileInputRef.current.click()}
                      disabled={loading}
                      style={{ padding: '8px 12px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                    >
                      Select Image(s)
                    </button>
                    <input ref={stateFileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleSelectFiles(e, 'state')} />
                  </div>
                    {/* Previews: selected (local) then existing (uploaded URLs) */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      {statePreviews.map((p, idx) => (
                        <div key={`local-state-${idx}`} style={{ position: 'relative' }}>
                          <img src={p.url} alt={p.name} style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} onError={(e) => { e.target.src = '/error.svg'; }} />
                          <button onClick={() => removeSelectedPreview(idx, 'state')} type="button" style={{ position: 'absolute', top: -8, right: -8, background: '#f44336', color: 'white', border: 'none', borderRadius: 12, width: 24, height: 24, cursor: 'pointer' }}>×</button>
                        </div>
                      ))}

                      {parseImageUrls(newState.images).map((u) => (
                        <div key={u} style={{ position: 'relative' }}>
                          <img src={u} alt="preview" style={{ width: 96, height: 64, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} onError={(e) => { e.target.src = '/error.svg'; }} />
                          <button onClick={() => removeImageUrl(u, 'state')} type="button" style={{ position: 'absolute', top: -8, right: -8, background: '#f44336', color: 'white', border: 'none', borderRadius: 12, width: 24, height: 24, cursor: 'pointer' }}>×</button>
                        </div>
                      ))}
                    </div>
                </div>
              </div>

              <div style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "var(--dark)", fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>Map Embed (paste iframe tag or src URL)</label>
                <textarea
                  value={newState.mapLink}
                  onChange={(e) => setNewState({ ...newState, mapLink: e.target.value })}
                  rows="2"
                  style={{ width: "100%", padding: "clamp(8px, 2vw, 12px)", border: "1px solid #ddd", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)", fontFamily: "inherit" }}
                />

                {extractMapSrc(newState.mapLink) && (
                    <div className="responsive-iframe">
                      <iframe
                        title="state-map-preview"
                        src={extractMapSrc(newState.mapLink)}
                        loading="lazy"
                      />
                    </div>
                  )}
              </div>

                <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", flexWrap: "wrap" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: "clamp(10px, 2vw, 12px) clamp(24px, 6vw, 32px)", background: "var(--accent)", color: "white", border: "none", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1, transition: "var(--transition)" }}
                >
                  {loading ? (editingState ? "Updating..." : "Creating...") : (editingState ? "Update State" : "Create State")}
                </button>
                {editingState && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingState(null);
                      setNewState({ name: "", type: "State", capital: "", description: "", bestTimeToVisit: "", images: "", mapLink: "" });
                      setStateSelectedFiles([]);
                      statePreviews.forEach(p => p.url && URL.revokeObjectURL(p.url));
                      setStatePreviews([]);
                    }}
                    style={{ padding: "clamp(10px, 2vw, 12px) clamp(24px, 6vw, 32px)", background: "#ccc", color: "#333", border: "none", borderRadius: "6px", fontSize: "clamp(0.9rem, 2vw, 1rem)", fontWeight: "600", cursor: "pointer", transition: "var(--transition)" }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 style={{ fontFamily: "var(--heading)", fontSize: "2rem", marginBottom: "24px", color: "var(--dark)" }}>
              Analytics & Statistics
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px"
            }}>
              {/* Content Summary */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.3rem", marginBottom: "16px", color: "var(--dark)", display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><path d="M7 13v4"></path><path d="M12 9v8"></path><path d="M17 5v12"></path></svg>
                    Content Summary
                  </h3>
                <div style={{ color: "var(--muted)" }}>
                  <p style={{ marginBottom: "12px" }}>
                    <strong>Total States:</strong> {states.length}
                  </p>
                  <p style={{ marginBottom: "12px" }}>
                    <strong>Total Destinations:</strong> {destinations.length}
                  </p>
                  <p style={{ marginBottom: "12px" }}>
                    <strong>Published:</strong> {destinations.filter(d => d.isApproved).length}
                  </p>
                  <p>
                    <strong>Pending Approval:</strong> {destinations.filter(d => !d.isApproved).length}
                  </p>
                </div>
              </div>

              {/* Content by Category */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.3rem", marginBottom: "16px", color: "var(--dark)", display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41L11 3.83a2 2 0 0 0-2.83 0L3.41 8.59a2 2 0 0 0 0 2.82l9.59 9.59a2 2 0 0 0 2.82 0l4.76-4.76a2 2 0 0 0 0-2.82z"></path><circle cx="7.5" cy="7.5" r="1.5"></circle></svg>
                  Destinations by Category
                </h3>
                <div style={{ color: "var(--muted)" }}>
                  {["Heritage", "Nature", "Religious", "Adventure", "Beach", "Hill Station"].map(cat => {
                    const count = destinations.filter(d => d.category === cat).length;
                    return (
                      <p key={cat} style={{ marginBottom: "8px" }}>
                        <strong>{cat}:</strong> {count}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Content by State */}
              <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}>
                <h3 style={{ fontFamily: "var(--heading)", fontSize: "1.3rem", marginBottom: "16px", color: "var(--dark)", display: 'flex', alignItems: 'center', gap: 8 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 11-9 11s-9-4-9-11a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  Top 5 States by Destinations
                </h3>
                <div style={{ color: "var(--muted)" }}>
                  {states
                    .map(state => ({
                      name: state.name,
                      count: destinations.filter(d => d.state?._id === state._id).length
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map((item, i) => (
                      <p key={i} style={{ marginBottom: "8px" }}>
                        <strong>{item.name}:</strong> {item.count}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          backdropFilter: "blur(5px)",
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{
            background: "white",
            borderRadius: "24px",
            padding: "0",
            maxWidth: "550px",
            width: "clamp(300px, 90vw, 550px)",
            boxShadow: "0 25px 80px rgba(0, 0, 0, 0.25)",
            animation: "modalSlideUp 0.5s cubic-bezier(0.23, 1, 0.32, 1)",
            overflow: "hidden"
          }}>
            {/* Gradient Header */}
            <div style={{
              background: `linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)`,
              padding: "clamp(20px, 5vw, 30px)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}/>
              <div style={{ fontSize: "48px", marginBottom: "12px", position: "relative" }}><IconSvg name="sparkle" size={48} /></div>
              <h2 style={{
                color: "white",
                fontFamily: "var(--heading)",
                fontSize: "clamp(1.4rem, 5vw, 1.9rem)",
                margin: "0 0 8px 0",
                fontWeight: 700,
                position: "relative"
              }}>
                {successType === 'destination' ? 'Destination Created!' : 'State Created!'}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: "0.95rem", position: "relative" }}>Ready to explore</p>
            </div>

            {/* Content Section */}
            <div style={{ padding: "clamp(20px, 5vw, 32px)" }}>
              {/* Item Thumbnail */}
              {createdItem && createdItem.images && createdItem.images[0] && (
                <div style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "20px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
                }}>
                  <img src={createdItem.images[0]} alt={successItemName} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.src = '/error.svg'; }} />
                </div>
              )}

              {/* Item Name */}
              <h3 style={{
                fontFamily: "var(--heading)",
                fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                color: "var(--dark)",
                margin: "0 0 12px 0",
                wordBreak: "break-word"
              }}>
                {successItemName}
              </h3>

              {/* Status Badge */}
              <div style={{
                background: "rgba(155, 74, 26, 0.08)",
                border: "2px solid var(--accent)",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "20px"
              }}>
                <p style={{ margin: "0 0 6px 0", color: "var(--dark)", fontWeight: 600 }}>
                  <IconSvg name="clipboard" size={18} style={{ marginRight: 8 }} /> Pending Review
                </p>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  Your {successType === 'destination' ? 'destination' : 'state'} has been created but requires admin approval before appearing on the site.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginTop: "24px"
              }}>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  style={{
                    padding: "clamp(12px, 3vw, 14px) 16px",
                    background: "transparent",
                    border: "2px solid #ddd",
                    color: "var(--dark)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.borderColor = "var(--accent)";
                    e.target.style.color = "var(--accent)";
                    e.target.style.background = "rgba(155, 74, 26, 0.05)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = "#ddd";
                    e.target.style.color = "var(--dark)";
                    e.target.style.background = "transparent";
                  }}
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setActiveTab(successType === 'destination' ? 'manage-destinations' : 'manage-states');
                  }}
                  style={{
                    padding: "clamp(12px, 3vw, 14px) 16px",
                    background: "linear-gradient(135deg, var(--accent) 0%, var(--dark) 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 6px 20px rgba(155, 74, 26, 0.3)"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(155, 74, 26, 0.4)";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 6px 20px rgba(155, 74, 26, 0.3)";
                  }}
                >
                  Go to Manage →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
      
    </div>
  );
}
