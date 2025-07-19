import { createContext, useState, useEffect } from "react";
import { me } from "../data/authAPI";
import PropTypes from "prop-types";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Aktifkan loading state

  const checkAuth = async () => {
    try {
      setLoading(true);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 5000);
      });

      const response = await Promise.race([me(), timeoutPromise]);
      setIsAuthenticated(!!response.success);
    } catch (err) {
      console.error("Authentication check failed:", err.message);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      // setLoading(true);
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 5000);
      });

      const response = await Promise.race([me(), timeoutPromise]);
      setIsAuthenticated(!!response.success);
    } catch (err) {
      console.error("Refresh auth failed:", err.message);
      setIsAuthenticated(false);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, refreshAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

AuthContext.propTypes = {
  children: PropTypes.node.isRequired,
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
