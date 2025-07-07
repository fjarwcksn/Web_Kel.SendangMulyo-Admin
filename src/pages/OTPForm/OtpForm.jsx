import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../../utils/data/authAPI"; // Make sure to import the verifyOtp function
import { HashLoader } from "react-spinners";

const OtpForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // To display any errors
  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (!/^[0-9]*$/.test(value)) return; // Only allow numeric input
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to the next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset any previous error

    const otpCode = otp.join(""); // Join the OTP digits into a single string

    try {
      // Make the API call to verify OTP
      const response = await verifyOtp({ otp: otpCode });

      if (response.success) {
        // If OTP verification is successful, redirect to login page
        navigate("/login");
      } else {
        // If verification fails, display an error
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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

      {/* OTP Verification Form */}
      <div className="w-full max-w-md p-6 bg-white shadow rounded z-10">
        <h2 className="text-2xl font-bold text-center mb-4">
          Account Verification
        </h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter the 6-digit verification code that was sent to your email.
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {/* Show error message if any */}
          {error && (
            <p className="text-sm text-primary text-center mt-4">{error}</p>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              className="max-w-lg w-5/6 mx-auto block p-2 border bg-primary text-white py-2 px-4 rounded text-sm hover:bg-secondary transition-all ease-in-out duration-200"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
            <p className="text-sm text-center">
              Didn’t receive the code?{" "}
              <a
                onClick={() => navigate("/resend-otp")}
                className="text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                Resend
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpForm;
