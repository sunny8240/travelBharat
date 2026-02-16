const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

export const apiClient = {
  async request(endpoint, options = {}) {
    const { method = 'GET', body = null, headers = {}, ...rest } = options;
    
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      ...rest
    };

    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = 'API Error';
        try {
          const error = await response.json();
          errorMessage = error.message || `Server Error: ${response.status}`;
        } catch {
          errorMessage = `Server Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (err) {
      if (err instanceof TypeError) {
        throw new Error('Network error: Unable to connect to server. Please check your connection or try again later.');
      }
      throw err;
    }
  },

  // States API
  states: {
    getAll: () => apiClient.request('/states'),
    getAllAdmin: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return apiClient.request(`/states/all?${params.toString()}`);
    },
    getBySlug: (slug) => apiClient.request(`/states/${slug}`),
    create: (data) => apiClient.request('/states', { method: 'POST', body: data }),
    update: (id, data) => apiClient.request(`/states/${id}`, { method: 'PUT', body: data }),
    approve: (id) => apiClient.request(`/states/${id}/approve`, { method: 'PATCH' }),
    delete: (id) => apiClient.request(`/states/${id}`, { method: 'DELETE' })
  },

  // Destinations API
  destinations: {
    getAll: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return apiClient.request(`/destinations?${params.toString()}`);
    },
    getAllAdmin: (filters = {}) => {
      const params = new URLSearchParams(filters);
      return apiClient.request(`/destinations/all?${params.toString()}`);
    },
    getBySlug: (slug) => apiClient.request(`/destinations/slug/${slug}`),
    getById: (id) => apiClient.request(`/destinations/${id}`),
    getByState: (stateId) => apiClient.request(`/destinations/state/${stateId}`),
    getNearby: (lat, lng, radiusKm = 50, limit = 6) => {
      const params = new URLSearchParams({ lat, lng, radiusKm, limit });
      return apiClient.request(`/destinations/nearby?${params.toString()}`);
    },
    create: (data) => apiClient.request('/destinations', { method: 'POST', body: data }),
    update: (id, data) => apiClient.request(`/destinations/${id}`, { method: 'PUT', body: data }),
    approve: (id) => apiClient.request(`/destinations/${id}/approve`, { method: 'PATCH' }),
    delete: (id) => apiClient.request(`/destinations/${id}`, { method: 'DELETE' })
  },

  // Auth API
  auth: {
    login: (email, password) => 
      apiClient.request('/auth/admin-login', { 
        method: 'POST', 
        body: { email, password } 
      }),
    createAdmin: (data) => 
      apiClient.request('/auth/create-admin', { 
        method: 'POST', 
        body: data 
      }),
    getCurrentUser: () => apiClient.request('/auth/me'),
    logout: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Uploads API
  uploads: {
    uploadImage: async (file) => {
      const token = localStorage.getItem('authToken');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/uploads`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      const data = await response.json();
      return data;
    }
  }
};

export default apiClient;
