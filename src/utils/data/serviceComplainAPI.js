// src/api.js
import axios from "axios";

const API_URL =
  "http://localhost:5000/api/v1/servicecomplaint"; // Sesuaikan dengan URL backend
// const API_URL = "http://localhost:5000/api/v1/servicecomplaint";

export const getAllServiceComplain = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createServiceComplain = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteServiceComplain = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const respondServiceComplain = async (
  id,
  responderName,
  responseText
) => {
  try {
    const response = await axios.post(
      `${API_URL}/respond/${id}`,
      { responderName, responseText },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
