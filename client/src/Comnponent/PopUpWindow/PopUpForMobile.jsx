// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import OtpInput from "otp-input-react";
// import { useState } from "react";
// import { toast, Toaster } from "react-hot-toast";
// import { BsFillShieldLockFill } from "react-icons/bs";
// import { CgSpinner } from "react-icons/cg";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import { auth } from "../../api/firebase.Config";
// import "./PopUpWindow.css"; // Import the CSS file

// function PopUpForMobile({
//   selectedLanguage,
//   applyLanguageChange,
//   setShowPopUp,
// }) {
//   const [otp, setOtp] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showOTP, setShowOTP] = useState(false);
//   const [user, setUser] = useState(null);

//   const handleSendOtp = async () => {
//     if (selectedLanguage === "fr") {
//       return;
//     }
//     const profile = JSON.parse(localStorage.getItem("Profile"));
//     if (!profile) return;

//     const existingPhoneNumber = profile?.result?.phoneNumber;

//     if (!existingPhoneNumber && !phoneNumber) {
//       alert("Please enter your phone number.");
//       return;
//     }

//     onSignup(phoneNumber || existingPhoneNumber);
//   };

//   const handlePhoneChange = (value) => {
//     setPhoneNumber(value);
//   };

//   const handleSubmit = () => {
//     onOTPVerify();
//     applyLanguageChange(otp);
//   };

//   function onCaptchVerify() {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         "recaptcha-container",
//         {
//           size: "invisible",
//           callback: (response) => {
//             onSignup();
//           },
//           "expired-callback": () => {},
//         },
//         auth
//       );
//     }
//   }

//   function onSignup(phone) {
//     setLoading(true);
//     onCaptchVerify();

//     const appVerifier = window.recaptchaVerifier;

//     const formatPh = "+" + phone;

//     signInWithPhoneNumber(auth, formatPh, appVerifier)
//       .then((confirmationResult) => {
//         window.confirmationResult = confirmationResult;
//         setLoading(false);
//         setShowOTP(true);
//         toast.success("OTP sent successfully!");
//       })
//       .catch((error) => {
//         console.error(error);
//         setLoading(false);
//       });
//   }

//   function onOTPVerify() {
//     setLoading(true);
//     window.confirmationResult
//       .confirm(otp)
//       .then(async (res) => {
//         console.log(res);
//         setUser(res.user);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setLoading(false);
//       });
//   }

//   return (
//     <div className="popup-overlay">
//       <div className="popup-window">
//         <Toaster toastOptions={{ duration: 4000 }} />
//         <div id="recaptcha-container"></div>
//         <button className="close-button" onClick={() => setShowPopUp(false)}>
//           &times;
//         </button>
//         <h3>OTP Verification</h3>
//         {!showOTP && (
//           <>
//             <PhoneInput
//               country={"in"}
//               value={phoneNumber}
//               onChange={handlePhoneChange}
//               inputStyle={{ width: "100%" }}
//             />
//             <button onClick={handleSendOtp} className="send-otp-button">
//               {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
//               Send OTP
//             </button>
//           </>
//         )}
//         {showOTP && (
//           <>
//             <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
//               <BsFillShieldLockFill size={30} />
//             </div>
//             <label htmlFor="otp" className="font-bold text-xl text-center">
//               Enter your OTP
//             </label>
//             <OtpInput
//               value={otp}
//               onChange={setOtp}
//               OTPLength={6}
//               otpType="number"
//               disabled={false}
//               autoFocus
//               className="otp-input-container"
//             />
//             <button onClick={handleSubmit} className="verify-otp-button">
//               {loading && <CgSpinner size={20} className="mt-1 animate-spin" />}
//               Verify OTP
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// export default PopUpForMobile;
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import React from "react";
// import { auth } from "../../api/firebase.Config"; // Ensure this path is correct based on your project structure

// class PopUpForMobile extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       mobile: "",
//       otp: "",
//     };
//   }

//   handleChange = (e) => {
//     const { name, value } = e.target;
//     this.setState({
//       [name]: value,
//     });
//   };

//   configureCaptcha = () => {
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       "sign-in-button",
//       {
//         size: "invisible",
//         callback: (response) => {
//           this.onSignInSubmit();
//           console.log("Recaptcha verified", response);
//         },
//         defaultCountry: "IN",
//       },
//       auth
//     );
//   };

//   onSignInSubmit = (e) => {
//     e.preventDefault();
//     this.configureCaptcha();
//     const phoneNumber = "+91" + this.state.mobile;
//     console.log(phoneNumber);
//     const appVerifier = window.recaptchaVerifier;
//     signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//       .then((confirmationResult) => {
//         window.confirmationResult = confirmationResult;
//         console.log("OTP has been sent");
//       })
//       .catch((error) => {
//         console.log("SMS not sent", error);
//       });
//   };

//   onSubmitOTP = (e) => {
//     e.preventDefault();
//     const code = this.state.otp;
//     console.log(code);
//     window.confirmationResult
//       .confirm(code)
//       .then((result) => {
//         const user = result.user;
//         console.log(JSON.stringify(user));
//         alert("User is verified");
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };

//   render() {
//     return (
//       <div>
//         <h2>Login Form</h2>
//         <form onSubmit={this.onSignInSubmit}>
//           <div id="sign-in-button"></div>
//           <input
//             type="number"
//             name="mobile"
//             placeholder="Mobile number"
//             required
//             onChange={this.handleChange}
//           />
//           <button type="submit">Submit</button>
//         </form>

//         <h2>Enter OTP</h2>
//         <form onSubmit={this.onSubmitOTP}>
//           <input
//             type="number"
//             name="otp"
//             placeholder="OTP Number"
//             required
//             onChange={this.handleChange}
//           />
//           <button type="submit">Submit</button>
//         </form>
//       </div>
//     );
//   }
// }

// export default PopUpForMobile;
