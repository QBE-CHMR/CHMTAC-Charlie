import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_DAL_HOST || 'http://localhost:5000',
  timeout: 10000,
});

export const submitReport = async (data) => {
  try {
    const contactType = process.env.REACT_APP_CONTACT_TYPE || 'DOD';
    const endpoint = `/report?type=${encodeURIComponent(contactType)}`;

    // Debugging: Log the FormData object
    console.log('FormData being submitted:');
    for (let pair of data.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await api.post(endpoint, data, {
      headers: { 'Content-Type': 'multipart/form-data' }, // Optional: Axios sets this automatically
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting the report:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
