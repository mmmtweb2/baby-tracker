const API_BASE = '/api';

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'שגיאה בשרת' }));
    throw new Error(error.message);
  }
  
  return response.json();
}

// Feedings API
export const feedingsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/feedings${query ? `?${query}` : ''}`);
  },
  
  getById: (id) => apiCall(`/feedings/${id}`),
  
  create: (data) => apiCall('/feedings', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/feedings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/feedings/${id}`, {
    method: 'DELETE',
  }),
};

// Vomits API
export const vomitsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/vomits${query ? `?${query}` : ''}`);
  },
  
  getById: (id) => apiCall(`/vomits/${id}`),
  
  create: (data) => apiCall('/vomits', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id, data) => apiCall(`/vomits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id) => apiCall(`/vomits/${id}`, {
    method: 'DELETE',
  }),
};

// Analytics API
export const analyticsApi = {
  getCategoryCorrelation: (days = 30) => 
    apiCall(`/analytics/category-correlation?days=${days}`),
  
  getTimeAnalysis: (days = 30) => 
    apiCall(`/analytics/time-analysis?days=${days}`),
  
  getHourlyPattern: (days = 30) => 
    apiCall(`/analytics/hourly-pattern?days=${days}`),
  
  getDailySummary: (days = 7) => 
    apiCall(`/analytics/daily-summary?days=${days}`),
  
  getFoodAnalysis: (days = 30) => 
    apiCall(`/analytics/food-analysis?days=${days}`),
};

// Health check
export const healthCheck = () => apiCall('/health');
