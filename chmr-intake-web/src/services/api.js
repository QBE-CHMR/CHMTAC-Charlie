import axios from 'axios';

const api = axios.create({
  baseURL: process.env.DAL_HOST,
  timeout: 10000,
  withCredentials: true, // Include credentials (cookies) in requests
});

// Fetch CSRF token and set it in Axios defaults
const initializeCSRF = async () => {
  try {
    const response = await api.get('/csrf-token');
    api.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
    console.log('CSRF token initialized:', response.data.csrfToken); // Debugging log
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

// Initialize CSRF token when the module is loaded
initializeCSRF();

export const submitReport = async (data) => {
  try {
    const contactType = process.env.REACT_APP_CONTACT_TYPE || 'DOD';
    const endpoint = `/report?type=${encodeURIComponent(contactType)}`;


    let formData;

    if (data instanceof FormData) {
      formData = data;
    } else {
      formData = new FormData();
      for (const key of Object.keys(data)) {
        if (key !== "files") formData.append(key, data[key]);
      }
      if (data.files && data.files.length > 0) {
        for (const file of data.files) formData.append("files", file);
      }
    }

    const response = await api.post(endpoint, formData);
    return response.data;
  } catch (error) {
    console.error('Error submitting the report:', error);
    throw error;
  }
};

export default api;
