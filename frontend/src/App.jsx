import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./context/ProtectedRoute";
import Navbar from "./component/Navbar.jsx";
import Footer from "./component/Footer";
import Home from "./pages/Home";
import StatesPage from "./pages/StatesPage";
import DestinationsPage from "./pages/DestinationsPage";
import DestinationExplorer from "./pages/DestinationExplorer";
import DestinationDetail from "./pages/DestinationDetail";
import StateDestinations from "./pages/StateDestinations";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import "./App.css";

function AppContent() {
  const { checkAuth } = useAuth();
  useEffect(() => {
    checkAuth();
  }, []);
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/states" element={<StatesPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/explore-destinations" element={<DestinationExplorer />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/state/:slug" element={<StateDestinations />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}