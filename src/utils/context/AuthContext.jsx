import { createContext, useState, useEffect, useContext } from "react";
import { me, loginUser, logoutUser } from "../data/authAPI";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import axios from "axios"; // Import axios di sini

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengatur header Authorization global untuk Axios
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log("Axios Authorization header set.");
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log("Axios Authorization header removed.");
    }
  };

  const checkAuth = async () => {
    try {
      setLoading(true);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Authentication check request timed out")), 5000);
      });

      // Coba ambil token dari localStorage terlebih dahulu (jika disimpan di sana)
      let token = localStorage.getItem('token');
      if (!token) {
        // Jika tidak ada di localStorage, coba ambil dari cookie (jika ada)
        token = Cookies.get('jwt');
      }

      if (token) {
        setAuthHeader(token); // Atur header Authorization sebelum memanggil me()
        const response = await Promise.race([me(), timeoutPromise]); 

        if (response.success && response.data) {
          setUser(response.data);
          setIsAuthenticated(true);
          localStorage.setItem('token', token); // Pastikan token selalu ada di localStorage
          console.log("Authentication check successful. User:", response.data.email);
        } else {
          // Jika me() gagal meskipun ada token, berarti token tidak valid
          throw new Error("Invalid token or session.");
        }
      } else {
        throw new Error("No token found in localStorage or cookies.");
      }
    } catch (err) {
      console.error("Authentication check failed:", err.message);
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token'); // Hapus token dari localStorage
      Cookies.remove('jwt'); // Hapus cookie JWT
      setAuthHeader(null); // Hapus header Authorization
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await loginUser({ email, password }); 
      
      if (response.success && response.token) { // Pastikan respons memiliki token
        localStorage.setItem('token', response.token); // Simpan token ke localStorage
        setAuthHeader(response.token); // Atur header Authorization segera
        await checkAuth(); // Verifikasi sesi baru dengan token yang baru disimpan
        console.log("Login successful. Checking auth status...");
        return { success: true, message: response.message };
      } else {
        // Jika login API gagal atau tidak ada token di respons
        throw new Error(response.message || "Login gagal: Token tidak diterima.");
      }
    } catch (error) {
      console.error("Login failed in AuthContext:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      Cookies.remove('jwt');
      setAuthHeader(null);
      return { success: false, message: error.response?.data?.message || "Login gagal." };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const response = await logoutUser();
      if (response.success) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token'); // Hapus token dari localStorage
        Cookies.remove('jwt'); 
        setAuthHeader(null); // Hapus header Authorization
        console.log("Logout successful.");
        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      Cookies.remove('jwt');
      setAuthHeader(null);
      return { success: false, message: error.response?.data?.message || "Logout gagal." };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const authContextValue = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshAuth: checkAuth,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
          <p className="text-primary text-lg font-semibold">Memuat sesi...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

AuthContext.propTypes = {
  children: PropTypes.node.isRequired,
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
