/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login, signup, verifyOtp } from "../../action/auth";
import icon from "../../assets/icon.png";
import Aboutauth from "./Aboutauth";
import "./Auth.css";

const Auth = () => {
  const [issignup, setissignup] = useState(false);
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [notification, setNotification] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const { t } = useTranslation();
  const authdata = t("auth").split(" + ");
  const authdata1 = t("auth1").split(" + ");
  const [
    Display,
    Email,
    Password,
    forgot,
    must,
    characters,
    number,
    optin,
    product,
    company,
    By,
    terms,
  ] = authdata;
  const [service, privacy, AND, cookie, already, donot, log, sign] = authdata1;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const displayNotification = (message) => {
    setNotification(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 6000); // Display notification for 5 seconds
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      displayNotification("Enter email and password");
      return;
    }
    if (issignup) {
      if (!name) {
        displayNotification("Enter a name to continue");
        return;
      }
      displayNotification("Sending OTP please Wait!");
      dispatch(
        signup({ name, email, password }, (response) => {
          if (response?.message === "OTP sent to email") {
            setShowOtpInput(true);
            displayNotification("OTP sent to email");
          } else {
            navigate("/");
            displayNotification("Signup successful");
          }
        })
      );
    } else {
      dispatch(
        login({ email, password }, (response) => {
          displayNotification("Sending OTP please Wait!");
          if (response?.message === "OTP sent to email") {
            setShowOtpInput(true);
            displayNotification("OTP sent to email");
          } else if (response?.token) {
            navigate("/");
            displayNotification("Login successful");
          } else {
            displayNotification(response?.message || "Login failed");
          }
        })
      );
    }
  };

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(
      verifyOtp({ email, otp }, (response) => {
        if (response?.token) {
          navigate("/");
          displayNotification("Login successful");
        } else {
          displayNotification("Invalid OTP");
        }
      })
    );
  };

  const handleswitch = () => {
    setissignup(!issignup);
    setname("");
    setemail("");
    setpassword("");
    setOtp("");
    setShowOtpInput(false);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <section className="auth-section">
      {issignup && <Aboutauth />}
      <div className="auth-container-2">
        <img src={icon} alt="icon" className="login-logo" />
        {showNotification && (
          <div className="notification">
            <span>{notification}</span>
            <button onClick={closeNotification} className="close-btn">
              &times;
            </button>
          </div>
        )}
        <form onSubmit={showOtpInput ? handleOtpVerification : handlesubmit}>
          {issignup && (
            <label htmlFor="name">
              <h4>{Display}</h4>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
            </label>
          )}
          <label htmlFor="email">
            <h4>{Email}</h4>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
            />
          </label>
          <label htmlFor="password">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h4>{Password}</h4>
              {!issignup && (
                <p style={{ color: "#007ac6", fontSize: "13px" }}>
                  <Link to="/forgotpassword">{forgot}</Link>
                </p>
              )}
            </div>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </label>
          {showOtpInput && (
            <label htmlFor="otp">
              <h4>Enter OTP</h4>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </label>
          )}
          <button
            type="submit"
            className="auth-btn"
            onClick={() => displayNotification("Please Wait!")}
          >
            {showOtpInput ? "Verify OTP" : issignup ? sign : log}
          </button>
        </form>
        <p>
          {issignup ? already : donot}
          <button
            type="button"
            className="handle-switch-btn"
            onClick={handleswitch}
          >
            {issignup ? log : sign}
          </button>
        </p>
      </div>
    </section>
  );
};

export default Auth;
