import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/slider"; // Sesuaikan dengan URL backend
// const API_URL = "http://localhost:5000/api/v1/slider";

export const getAllSlider = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sliders:", error);
    throw error.response?.data || error.message || "Network Error";
  }
};

export const createSlider = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating slider:", error);
    throw error.response?.data || error.message || "Network Error";
  }
};

export const deleteSlider = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting slider:", error);
    throw error.response?.data || error.message || "Network Error";
  }
};

export const updateSlider = async (id, formData) => {
  try {
    const response = await axios.patch(`${API_URL}/edit/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating slider:", error);
    throw error.response?.data || error.message || "Network Error";
  }
};

export const getSliderById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching slider by ID:", error);
    throw error.response?.data || error.message || "Network Error";
  }
};
