import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://vigovia-render-1.onrender.com';
console.log(' Using API_BASE_URL:', API_BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for PDF generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data);
    
    // Handle different error types
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid request data');
        case 500:
          throw new Error(data.message || 'Server error occurred');
        default:
          throw new Error(data.message || `Request failed with status ${status}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

export const itineraryAPI = {
  /**
   * Generate itinerary PDF
   * @param {Object} itineraryData - Complete itinerary data
   * @returns {Promise} API response with download URL
   */
  generateItinerary: async (itineraryData) => {
    try {
      console.log('📝 Generating itinerary for:', itineraryData.userDetails?.name);
      
      const response = await api.post('/api/generate-itinerary', itineraryData);
      
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('❌ Itinerary generation failed:', error.message);
      
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Health check endpoint
   * @returns {Promise} Server health status
   */
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error.message);
      throw new Error('Server is not responding');
    }
  },

  /**
   * Download generated PDF
   * @param {string} filename - PDF filename
   * @returns {string} Download URL
   */
  getDownloadUrl: (filename) => {
    return `${API_BASE_URL}/generated-pdfs/${filename}`;
  },
};

export default api;
