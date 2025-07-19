import { useState, useEffect, useContext } from "react";
import {
  Home,
  Users,
  Images,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Grid2x2,
  X,
  Headset,
  Settings,
  LoaderIcon,
} from "lucide-react";
import MenuItem from "../../components/menuItems/menuItem";
import PropTypes from "prop-types";
import logo from "../../assets/logo-kota-semarang.png";
import { me, logoutUser } from "../../utils/data/authAPI";
import { getInitialsAndColor } from "../../utils/helper.js";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../utils/context/AuthContext.jsx";
import toast from "react-hot-toast";
// import userImg from "../../assets/user.png";

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const navigate = useNavigate();
  const { refreshAuth } = useContext(AuthContext);
  const [activeItem] = useState("Dashboard");
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await me();
        setUserData({
          username: data.data.username || "fajaradji",
          email: data.data.email || "fajar@example.com",
          avatar: data.data.avatar || "",
        });
      } catch (error) {
        console.error("Gagal mengambil data pengguna:", error);
      }
    };

    fetchUserData();
  }, []);

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, path: "/" },
    { name: "Berita", icon: <Grid2x2 size={20} />, path: "/post" },
    { name: "Slider", icon: <Images size={20} />, path: "/slider" },
    { name: "Layanan", icon: <Headset size={20} />, path: "/layanan" },
    { name: "Users", icon: <Users size={20} />, path: "/users" },
  ];

  const footerItems = [
    { name: "Pengaturan", icon: <Settings size={20} />, path: "/settings" },
  ];

  const handleAvatarClick = () => {
    setIsAvatarModalOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      await refreshAuth();
      toast.success("Logout successful!");
      setIsAvatarModalOpen(false);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Gagal melakukan logout:", error);
      toast.error("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const { initials, color } = getInitialsAndColor(userData.username);

  return (
    <div
      className={`relative flex flex-col border-r border-gray-200 transition-all duration-300 ease-in-out
        ${
          isMobile
            ? `w-full ${isOpen ? "h-96" : "h-20"}`
            : `h-full ${isOpen ? "w-64" : "w-20"}`
        }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-4 p-2 rounded-full shadow bg-gray-100 text-gray-700 hover:bg-gray-200
          ${isMobile ? "right-4" : "-right-5"}`}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isMobile ? (
          isOpen ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )
        ) : isOpen ? (
          <ChevronLeft size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>

      {/* Logo Section */}
      <div
        className={`flex items-center py-4 px-4 ${
          isMobile ? "justify-between" : "justify-center"
        }`}
      >
        {isOpen ? (
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-12 h-auto" />
            <span className="text-lg font-bold text-font1">Admin Panel</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-12 h-auto" />
            {isMobile && (
              <span className="text-lg font-bold text-font1">Admin Panel</span>
            )}
          </div>
        )}
      </div>

      {/* Menu Items (Hidden when closed on mobile) */}
      {(!isMobile || isOpen) && (
        <>
          <div className="border-t border-gray-200 mx-4"></div>
          <ul
            className={`flex-1 px-2 space-y-2 mt-5 text-sm ${
              isMobile ? "flex flex-col" : ""
            }`}
          >
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                name={item.name}
                icon={item.icon}
                isActive={activeItem === item.name}
                isOpen={isOpen}
                path={item.path}
              />
            ))}
          </ul>

          {/* Footer Items */}
          <ul className="px-2 space-y-2 mb-3 text-sm">
            {footerItems.map((item, index) => (
              <MenuItem
                key={index}
                name={item.name}
                icon={item.icon}
                isActive={activeItem === item.name}
                isOpen={isOpen}
                path={item.path}
              />
            ))}
          </ul>

          {/* Divider */}
          <div className="border-t border-gray-200 mx-4"></div>

          {/* User Section */}
          <div
            className={`flex items-center p-5 ${
              isMobile ? "justify-between" : ""
            }`}
          >
            <div className="relative">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full cursor-pointer hover:bg-gray-100"
                  onClick={handleAvatarClick}
                >
                  {userData.avatar ? (
                    <img
                      src={userData.avatar}
                      alt={userData.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                      style={{ backgroundColor: color }}
                    >
                      {initials}
                    </span>
                  )}
                </div>

                {isMobile && (
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700">
                      {userData.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      ( {userData.email} )
                    </span>
                  </div>
                )}
              </div>

              {/* Avatar Modal */}
              {isAvatarModalOpen && (
                <div
                  className={`absolute border shadow rounded-md p-4 z-10 w-max bg-white
                    ${isMobile ? "top-12 left-0" : "bottom-0 left-12"}`}
                >
                  <div className="flex items-center space-x-2">
                    {userData.avatar ? (
                      <img
                        src={userData.avatar}
                        alt={userData.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-sm"
                        style={{ backgroundColor: color }}
                      >
                        {initials}
                      </span>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-700">
                          {userData.username}
                        </p>
                        <X
                          size={18}
                          className="cursor-pointer text-gray-600 hover:text-gray-800 absolute top-2 right-2"
                          onClick={() => setIsAvatarModalOpen(false)}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoading}
                      className={`w-full py-1.5 rounded text-sm flex items-center justify-center
                        ${
                          isLoading
                            ? "bg-red-200 text-red-700 cursor-not-allowed"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                    >
                      {isLoading ? (
                        <>
                          <LoaderIcon className="animate-spin mr-2 h-4 w-4" />
                          Logging out...
                        </>
                      ) : (
                        "Logout"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {isOpen && !isMobile && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {userData.username}
                </p>
                <p className="truncate w-40 text-xs text-gray-500">
                  {userData.email}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default Sidebar;
