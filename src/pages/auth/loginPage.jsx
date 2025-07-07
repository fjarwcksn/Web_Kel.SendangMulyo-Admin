import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { loginUser } from "../../utils/data/authAPI"; // Pastikan path ini sesuai
import { HashLoader } from "react-spinners";
import toast from "react-hot-toast";
// src/pages/auth/loginPage.jsx
import { useAuth } from "../../utils/context/AuthContext.jsx"; 

const LoginPage = () => {
      const navigate = useNavigate();
      const { login } = useAuth(); // Dapatkan fungsi login dari AuthContext
      const [formData, setFormData] = useState({
        email: "",
        password: "",
      });

      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Panggil fungsi login dari context
          const result = await login(formData.email, formData.password); 
          if (result.success) {
            toast.success(result.message);
            navigate("/dashboard"); // Arahkan ke dashboard setelah login berhasil
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error("Login error:", error);
          toast.error(error.message || "Terjadi kesalahan saat login.");
        }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded text-sm"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded text-sm hover:bg-secondary transition-all ease-in-out duration-200"
              >
                Login
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don{"'"}t have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      );
    };

    export default LoginPage;
    
    