/* eslint-disable no-undef */
import axios from "axios";
// import { initializeApp } from "firebase/app";
// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import firebaseConfig from "./firebase.Config";

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

const API = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "https://mern-stack-overflow.onrender.com",
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("Profile")).token
    }`;
  }
  return req;
});

export const sendOtpToEmail = async (email) => {
  try {
    const response = await API.post("/user/sendOtpEmail", { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP to email:", error);
    throw error;
  }
};
export const sendOtpToPhone = async (email) => {
  try {
    const response = await API.post("/user/sendOtpEmail", { email });
    return response.data;
  } catch (error) {
    console.error("Error sending OTP to email:", error);
    throw error;
  }
};
// export const sendOtpToPhoneWithToken = async (phoneNumber) => {
//   try {
//     if (!window.recaptchaVerifier) {
//       window.recaptchaVerifier = new RecaptchaVerifier(
//         "recaptcha-container",
//         {
//           size: "invisible",
//         },
//         auth
//       );
//     }

//     const recaptchaVerifier = window.recaptchaVerifier;

//     const confirmationResult = await signInWithPhoneNumber(
//       auth,
//       phoneNumber,
//       recaptchaVerifier
//     );

//     window.confirmationResult = confirmationResult;
//     return { success: true, message: "OTP sent successfully" };
//   } catch (error) {
//     console.error("Error sending OTP to phone:", error);
//     throw error;
//   }
// };

export const login = (authdata) => API.post("user/login", authdata);
export const signup = (authdata) => API.post("user/signup", authdata);

export const getallusers = () => API.get("/user/getallusers");
export const updateprofile = (id, updatedata) =>
  API.patch(`user/update/${id}`, updatedata);

export const postquestion = (questiondata) =>
  API.post("/questions/Ask", questiondata);
export const getallquestions = () => API.get("/questions/get");
export const deletequestion = (id) => API.delete(`/questions/delete/${id}`);
export const votequestion = (id, value) =>
  API.patch(`/questions/vote/${id}`, { value });

export const postanswer = (id, noofanswers, answerbody, useranswered) =>
  API.patch(`/answer/post/${id}`, { noofanswers, answerbody, useranswered })
    .then((response) => {
      console.log("API post answer response: ", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("API post answer error: ", error);
      throw error;
    });

export const deleteanswer = (id, answerid, noofanswers) =>
  API.patch(`/answer/delete/${id}`, { answerid, noofanswers });

export const verifyOtp = (otpData) => API.post("user/verifyOtp", otpData);
export const getLoginHistory = () => API.get("/user/loginHistory");
export const forgotPassword = (email) =>
  API.post("/user/forgot-password", { email });
export const resetPassword = (id, token, newPassword, confirmPassword) =>
  API.post(`/user/reset-password/${id}/${token}`, {
    newPassword,
    confirmPassword,
  });
export const validateOtp = (email, otp) =>
  API.post("user/validate-otp", { email, otp });
export const verifyOtpLanguage = async (contact, otp) => {
  try {
    const response = await API.post("/user/verifyOtpLanguage", {
      contact,
      otp,
    });
    return response.data.success;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return false;
  }
};
