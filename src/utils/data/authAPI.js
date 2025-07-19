import axios from "axios";

// Pastikan ini menunjuk ke backend API lokal Anda
const API_URL = "http://localhost:5000/api/v1/user"; 
// const API_URL = "http://localhost:5000/api/v1/avatar";

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json', // Tambahkan header ini
    },
  });
  return response.data;
};

// Login user
export const loginUser = async (loginData) => {
  const response = await axios.post(`${API_URL}/login`, loginData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json', // Tambahkan header ini
    },
  });
  return response.data;
};

// Verify OTP
export const verifyOtp = async (otpData) => {
  const response = await axios.post(`${API_URL}/verify-otp`, otpData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json', // Tambahkan header ini
    },
  });
  return response.data;
};

// Resend OTP
export const resendOtp = async (email) => {
  const response = await axios.post(
    `${API_URL}/resend-otp`,
    { email }, // Pastikan ini mengirim objek { email: "..." }
    {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json', // Tambahkan header ini
      },
    }
  );
  return response.data;
};

// Get user data
export const me = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "No valid session found" };
  }
};

//get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/get/all`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "No valid session found" };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    // Untuk POST dengan body kosong, disarankan mengirim objek kosong {} daripada null
    const response = await axios.post(`${API_URL}/logout`, {}, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json', // Tambahkan header ini
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

// Update User
export const updateUser = async (userData, avatarFile = null) => {
  try {
    const formData = new FormData();

    if (userData.username) formData.append("username", userData.username);
    if (userData.firstname) formData.append("firstname", userData.firstname);
    if (userData.lastname) formData.append("lastname", userData.lastname);

    if (avatarFile) {
      formData.append("images", avatarFile); // Pastikan nama field 'images' sesuai dengan backend
    }

    // Untuk FormData, Content-Type: 'multipart/form-data' akan diatur otomatis oleh browser
    // Anda tidak perlu menentukannya secara manual di header axios saat mengirim FormData.
    // Jika Anda menentukannya, kadang bisa menyebabkan masalah.
    const response = await axios.put(`${API_URL}/update`, formData, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network error");
  }
};
