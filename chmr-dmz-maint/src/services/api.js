import axios from 'axios';

const api = axios.create({
  baseURL: process.env.DMZ_DAL_URL, // Backend URL
  timeout: 10000,
});

export const submitReport = async (data) => {
  try {
    const contactType = process.env.REACT_APP_CONTACT_TYPE || 'DOD';
    const endpoint = contactType === 'CIVILIAN' ? '/report/civilian' : '/report/dod';

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
