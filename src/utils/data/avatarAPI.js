import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/avatar"; // Sesuaikan dengan URL backend
// const API_URL = "http://localhost:5000/api/v1/avatar";

// Upload avatar
export const uploadAvatar = async (file, userId) => {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await axios.post(
      `${API_URL}/upload-avatar/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    console.log("Avatar uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};

// Update avatar
export const updateAvatar = async (formData, userId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/update-avatar/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updateAvatar API:", error.message);
    throw error;
  }
};

// Get avatar
export const getAvatar = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/avatar/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return null; // Kembalikan null jika ada error
  }
};
