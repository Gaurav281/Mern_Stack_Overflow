/* eslint-disable react/prop-types */
import { useState } from "react";
// import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { sendOtpToEmail } from "../../api";
import "./PopUpWindow.css"; // Import the CSS file

function PopUpWindow({ selectedLanguage, applyLanguageChange, setShowPopUp }) {
  const [otp, setOtp] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");

  const handleSendOtp = async () => {
    const profile = JSON.parse(localStorage.getItem("Profile"));
    if (!profile) return;
    const email = profile?.result?.email;
    // const existingPhoneNumber = profile?.result?.phoneNumber;

    if (selectedLanguage) {
      alert("Please Wait Sending OTP");
      await sendOtpToEmail(email);
      alert("OTP send to registered Email");
    } //else {
    //   if (!existingPhoneNumber && !phoneNumber) {
    //     alert("Please enter your phone number.");
    //     return;
    //   }
    //   await sendOtpToPhoneWithToken(phoneNumber || existingPhoneNumber);
    // }
  };

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  // const handlePhoneChange = (value) => {
  //   setPhoneNumber(value);
  // };

  const handleSubmit = () => {
    applyLanguageChange(otp);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-window">
        <button className="close-button" onClick={() => setShowPopUp(false)}>
          &times;
        </button>
        <h3>OTP Verification</h3>
        {/* {selectedLanguage !== "fr" && (
          <PhoneInput
            country={"in"}
            value={phoneNumber}
            onChange={handlePhoneChange}
            inputStyle={{ width: "100%" }}
          />
        )} */}
        <button onClick={handleSendOtp}>Send OTP</button>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>Verify OTP</button>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

export default PopUpWindow;
