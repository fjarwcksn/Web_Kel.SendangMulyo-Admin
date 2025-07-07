import { useState, useRef, useEffect } from "react";
import { UserRound, Mail } from "lucide-react";
import { me, updateUser } from "../../utils/data/authAPI";
import { getInitialsAndColor } from "../../utils/helper";
import toast from "react-hot-toast";

const Settings = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
    firstname: "",
    lastname: "",
  });
  const [avatarInitials, setAvatarInitials] = useState({
    initials: "",
    color: "",
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await me();
        const data = response.data;

        setUserData({
          username: data.username || "",
          email: data.email || "",
          avatar: data.avatar || "",
          firstname: data.firstname || "",
          lastname: data.lastname || "",
        });

        if (data.avatar) {
          setProfilePicture(data.avatar);
        } else if (data.username) {
          const { initials, color } = getInitialsAndColor(data.username);
          setAvatarInitials({ initials, color });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error(`Failed to fetch user data: ${error.message}`);
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
      setUserData((prev) => ({ ...prev, avatar: file }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const updatedData = {
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
      };

      const response = await updateUser(updatedData, userData.avatar);
      setUserData({
        ...userData,
        username: response.data.username,
        firstname: response.data.firstname,
        lastname: response.data.lastname,
        avatar: response.data.avatar,
      });
      setProfilePicture(response.data.avatar);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profil</h1>
      <div className="bg-white border border-borderPrimary rounded-md p-6">
        <div className="space-y-6">
          <div className="mb-6 flex justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div
                className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer"
                onClick={handleAvatarClick}
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : avatarInitials.initials ? (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: avatarInitials.color }}
                  >
                    <span className="text-white text-2xl font-bold">
                      {avatarInitials.initials}
                    </span>
                  </div>
                ) : (
                  <UserRound className="h-10 w-10 text-gray-400" />
                )}
              </div>
              <p className="text-[11px] font-semibold uppercase text-gray-500">
                ( klik pada avatar untuk mengganti )
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {[
                {
                  label: "First Name",
                  name: "firstname",
                  value: userData.firstname,
                  icon: UserRound,
                },
                {
                  label: "Last Name",
                  name: "lastname",
                  value: userData.lastname,
                  icon: UserRound,
                },
                {
                  label: "Username",
                  name: "username",
                  value: userData.username,
                  icon: UserRound,
                },
                {
                  label: "Email Address",
                  name: "email",
                  value: userData.email,
                  icon: Mail,
                  disabled: true,
                },
              ].map((field, index) => (
                <div key={index}>
                  <label className="text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <div
                    className={`text-sm p-3 rounded-md border border-gray-200 flex items-center gap-2 ${
                      field.disabled
                        ? "bg-gray-50 text-gray-500"
                        : "bg-white text-gray-900 shadow-sm border-gray-300"
                    }`}
                  >
                    {field.icon && (
                      <field.icon
                        className={`h-4 w-4 ${
                          field.disabled ? "text-gray-400" : "text-gray-600"
                        }`}
                      />
                    )}
                    <input
                      type="text"
                      name={field.name}
                      value={field.value || ""}
                      onChange={handleInputChange}
                      disabled={field.disabled || false}
                      className={`w-full bg-transparent outline-none ${
                        field.disabled
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-gray-900"
                      }`}
                      placeholder={
                        field.disabled ? "Not editable" : "Enter value"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="capitalize text-sm mt-2 bg-primary text-white px-4 py-2 rounded-md hover:border hover:border-font1 hover:bg-white hover:text-font1 transition duration-200"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
