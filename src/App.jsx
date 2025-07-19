import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Sidebar from "./pages/navigation/sidebar";
import { useState, useContext, useEffect } from "react";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Post from "./pages/post/Berita.jsx";
import Users from "./pages/users/Users.jsx";
import Settings from "./pages/setting/Settings.jsx";
// import HelpCenter from "./pages/helpcenter/helpCenter.jsx";
import Add from "./pages/post/addPost.jsx";
import EditPost from "./pages/post/editPost.jsx";
import Layanan from "./pages/layanan/Layanan.jsx";
import Slider from "./pages/slider/Slider.jsx";
import { Toaster } from "react-hot-toast";
import RegisterPage from "./pages/auth/registerPgae.jsx";
import LoginPage from "./pages/auth/loginPage.jsx";
import OtpForm from "./pages/OTPForm/OtpForm.jsx";
import ResendOtp from "./pages/ResendOTP/ResendOtp.jsx";
import AuthContext, { AuthProvider } from "./utils/context/AuthContext.jsx";
import { useMediaQuery } from "react-responsive";
// import { Loader } from "lucide-react";
import { HashLoader } from "react-spinners";

// PublicRoute component to restrict authenticated users from accessing auth routes
const PublicRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// PrivateRoute component to protect routes
const PrivateRoute = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Komponen Layout untuk rute yang memerlukan sidebar
const MainLayout = () => {
  const { refreshAuth } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  const toggleSidebar = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isDesktop || isTablet) {
      setIsOpen(true);
    } else if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, isTablet, isDesktop]);

  useEffect(() => {
    const initializeAuth = async () => {
      await refreshAuth();
    };
    initializeAuth();
  }, [refreshAuth]);

  return (
    <div
      className={isMobile ? "flex flex-col min-h-screen" : "flex min-h-screen"}
    >
      {/* Sidebar */}
      <div
        className={`fixed transition-all duration-300 ease-in-out z-30 bg-white 
          ${
            isMobile
              ? `left-0 top-0 w-full ${isOpen ? "h-[500px]" : "h-20"}`
              : `left-0 top-0 h-full ${isOpen ? "w-64" : "w-20"}`
          }`}
      >
        <Sidebar
          isOpen={isOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Konten Utama */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out min-h-screen bg-gray-50
          ${
            isMobile ? (isOpen ? "mt-96" : "mt-20") : isOpen ? "ml-64" : "ml-20"
          }
          ${isMobile ? "p-4" : isTablet ? "p-6" : "p-10"}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rute Autentikasi (Publik) */}
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<OtpForm />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/resend-otp" element={<ResendOtp />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Rute dengan Layout Utama (Privat) */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/post" element={<Post />} />
              <Route path="/slider" element={<Slider />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
              {/* <Route path="/help" element={<HelpCenter />} /> */}
              <Route path="/add-post" element={<Add />} />
              <Route path="/edit-post/:id" element={<EditPost />} />
              <Route path="/layanan" element={<Layanan />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;