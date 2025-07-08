import React, { useState, useEffect } from 'react'; // Pastikan React diimpor
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

// Import halaman-halaman autentikasi
import LoginPage from './pages/auth/loginPage.jsx';
import RegisterPage from './pages/auth/registerPgae.jsx';
import OtpForm from './pages/OTPForm/OtpForm.jsx';
import ResendOtp from './pages/ResendOTP/ResendOtp.jsx';

// Import halaman-halaman admin yang memerlukan sidebar dan proteksi
// PASTIKAN NAMA IMPORT INI SESUAI DENGAN NAMA EXPORT DEFAULT DI FILE KOMPONEN MASING-MASING
import Dashboard from './pages/dashboard/Dashboard.jsx'; // Contoh: export default Dashboard
import Post from './pages/post/Berita.jsx'; // Contoh: export default Post (dari Berita.jsx)
import Slider from './pages/slider/Slider.jsx'; // Contoh: export default Slider
import Users from './pages/users/Users.jsx'; // Contoh: export default Users
import Layanan from './pages/layanan/Layanan.jsx'; // Contoh: export default Layanan
import Settings from './pages/setting/Settings.jsx'; // Contoh: export default Settings
import Add from './pages/post/addPost.jsx'; // Contoh: export default Add (dari addPost.jsx)
import EditPost from './pages/post/editPost.jsx'; // Contoh: export default EditPost (dari editPost.jsx)

// Import komponen layout dan autentikasi
import Sidebar from "./pages/navigation/sidebar"; // Pastikan path ini benar
import { AuthProvider, useAuth } from './utils/context/AuthContext.jsx'; // Pastikan path ini benar

// Import utilitas dan UI lain
import { HashLoader } from "react-spinners";
import { Toaster } from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

// --- Komponen Layout Utama (MainLayout) ---
// Mengandung Sidebar dan area konten untuk rute terproteksi
const MainLayout = () => {
  const { refreshAuth, loading, isAuthenticated } = useAuth(); // Ambil isAuthenticated juga
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTablet = useMediaQuery({ minWidth: 769, maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025 });

  const toggleSidebar = () => setIsOpen(!isOpen);

  // Atur status sidebar berdasarkan ukuran layar
  useEffect(() => {
    if (isDesktop || isTablet) {
      setIsOpen(true);
    } else if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, isTablet, isDesktop]);

  // Refresh status autentikasi saat komponen dimuat atau status loading berubah
  useEffect(() => {
    if (!loading && isAuthenticated) { // Hanya refresh jika tidak sedang loading dan sudah terautentikasi
      refreshAuth();
    }
  }, [isAuthenticated, loading, refreshAuth]); // Tambahkan isAuthenticated dan loading sebagai dependency

  // Jika sedang loading autentikasi, tampilkan spinner (ini sudah ditangani di AuthProvider)
  // if (loading) {
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
  //       <HashLoader color="#C0392B" size={50} />
  //     </div>
  //   );
  // }

  // Jika tidak terautentikasi, MainLayout tidak boleh diakses, redirect ke login
  // Ini seharusnya sudah ditangani oleh PrivateRoute yang membungkus MainLayout
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={isMobile ? "flex flex-col min-h-screen" : "flex min-h-screen"}>
      {/* Sidebar */}
      <div
        className={`fixed transition-all duration-300 ease-in-out z-30 bg-white 
          ${isMobile ? `left-0 top-0 w-full ${isOpen ? "h-[500px]" : "h-20"}` : `left-0 top-0 h-full ${isOpen ? "w-64" : "w-20"}`}
        `}
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
          ${isMobile ? (isOpen ? "mt-96" : "mt-20") : isOpen ? "ml-64" : "ml-20"}
          ${isMobile ? "p-4" : isTablet ? "p-6" : "p-10"}`}
      >
        <Outlet /> {/* Ini akan merender komponen rute anak */}
      </div>
    </div>
  );
};

// --- Komponen Utama Aplikasi (App) ---
function App() {
  const { isAuthenticated, loading } = useAuth(); // Ambil status autentikasi di level teratas

  // Tampilkan loading spinner jika sedang memuat autentikasi awal
  // Ini penting agar halaman tidak blank sebelum status autentikasi diketahui
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <HashLoader color="#C0392B" size={50} />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rute Autentikasi (Publik) */}
        {/* Jika sudah terautentikasi, redirect dari rute publik ke dashboard */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/verify-otp" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <OtpForm />} />
        <Route path="/resend-otp" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResendOtp />} />

        {/* Rute Terproteksi (Membutuhkan Login) */}
        {/* Semua rute di dalam MainLayout akan terproteksi */}
        {/* PrivateRoute akan menangani redirect ke /login jika tidak terautentikasi */}
        <Route element={<MainLayout />}>
          {/* Default path "/" akan mengarah ke "/dashboard" jika sudah login */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/post" element={isAuthenticated ? <Post /> : <Navigate to="/login" replace />} />
          <Route path="/slider" element={isAuthenticated ? <Slider /> : <Navigate to="/login" replace />} />
          <Route path="/users" element={isAuthenticated ? <Users /> : <Navigate to="/login" replace />} />
          <Route path="/layanan" element={isAuthenticated ? <Layanan /> : <Navigate to="/login" replace />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" replace />} />
          <Route path="/add-post" element={isAuthenticated ? <Add /> : <Navigate to="/login" replace />} />
          <Route path="/edit-post/:id" element={isAuthenticated ? <EditPost /> : <Navigate to="/login" replace />} />
          
          {/* Catch-all route untuk rute yang tidak ditemukan di dalam MainLayout */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

// --- Komponen Pembungkus AuthProvider ---
// Ini harus berada di src/main.jsx atau di level tertinggi
// Saya menempatkannya di sini untuk kejelasan, tapi pastikan ini di level teratas
const RootApp = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default RootApp; // Export RootApp sebagai default
