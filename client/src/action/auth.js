import * as api from "../api";
import { setcurrentuser } from "./currentuser";
import { fetchallusers } from "./users";

export const signup = (authdata, callback) => async (dispatch) => {
  try {
    const { data } = await api.signup(authdata);
    if (data.message === "OTP sent to email") {
      callback(data);
    } else {
      dispatch({ type: "AUTH", data });
      dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
      dispatch(fetchallusers());
      callback();
    }
  } catch (error) {
    console.log(error);
  }
};

export const login = (authdata, callback) => async (dispatch) => {
  try {
    const { data } = await api.login(authdata);
    if (data.message === "OTP sent to email") {
      callback(data);
    } else {
      dispatch({ type: "AUTH", data });
      dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
      callback();
    }
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtp = (otpData, callback) => async (dispatch) => {
  try {
    const { data } = await api.verifyOtp(otpData);
    dispatch({ type: "AUTH", data });
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
    callback(data);
  } catch (error) {
    console.log(error);
  }
};

export const fetchLoginHistory = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await api.getLoginHistory(token);
    dispatch({ type: "FETCH_LOGIN_HISTORY", payload: data });
  } catch (error) {
    console.log(error);
  }
};
