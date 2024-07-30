import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword, resetPassword, validateOtp } from "../../api";
import "./NewFile.css";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword(email);
      setMessage(response.data.status);
      alert("Please Wait Sending OTP!");
      if (response.data.status === "OTP and reset link sent to email") {
        setOtpSent(true);
        setUserId(response.data.userId); // Assuming the response includes userId
        setToken(response.data.token); // Assuming the response includes token
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // console.log("newPassword:", newPassword);
    // console.log("confirmPassword:", confirmPassword);
    // console.log("userId:", userId);
    // console.log("token:", token);

    try {
      // Validate OTP first
      const validateResponse = await validateOtp(email, otp);
      if (validateResponse.data.status !== "OTP Verified") {
        setMessage("Invalid OTP");
        return;
      }

      // If OTP is valid, proceed with password reset
      const response = await resetPassword(
        userId,
        token,
        newPassword,
        confirmPassword
      );
      setMessage(response.data.status);
      navigate("/Auth");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong, please try again."
      );
    }
  };

  return (
    <div className="forget-password-container">
      <h2>Forgot Password</h2>
      {message && <p>{message}</p>}
      {!otpSent ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;
