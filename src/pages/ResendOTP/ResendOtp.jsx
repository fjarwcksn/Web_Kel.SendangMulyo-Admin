import { useState } from "react";
import { resendOtp } from "../../utils/data/authAPI";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";

const ResendOtp = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah form submit default
    setLoading(true); // Menampilkan spinner saat proses berlangsung

    try {
      // Memanggil API resendOtp untuk mengirim OTP ke email
      const response = await resendOtp(email);

      alert.success(response?.message || "OTP has been resent successfully!"); // Menampilkan pesan sukses

      setEmail(""); // Reset email input

      // Menavigasi ke halaman verify-otp setelah OTP berhasil dikirim
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 2000); // Delay 2 detik untuk memberikan waktu melihat notifikasi
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!"; // Menampilkan pesan error
      alert.error(errorMessage);
    } finally {
      setLoading(false); // Menghentikan spinner setelah proses selesai
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Spinner with dark background */}
      {loading && (
        <div className="h-full fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-black bg-opacity-50 w-full flex z-50">
          <HashLoader color="#C0392B" size={50} />
        </div>
      )}

      {/* Resend OTP Form */}
      <div className="w-full max-w-md p-6 bg-white shadow rounded z-10">
        <h2 className="text-2xl font-bold text-center mb-4">Resend OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full p-2 border border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              className="w-full p-2 bg-primary hover:bg-secondary text-white transition-all ease-in-out duration-200"
              disabled={loading}
            >
              {/* {loading ? "Sending..." : "Resend OTP"} */}
              Resend OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResendOtp;
