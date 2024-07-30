import express from "express";
import { login, signup, verifyOtp } from "../controller/auth.js";
import {
  forgetPassword,
  getallusers,
  getLoginHistory,
  reset,
  resetPassword,
  sendOtpEmail,
  sendOtpPhone,
  updateprofile,
  validateOtp,
  verifyOtpLanguage,
} from "../controller/users.js";
import auth from "../middleware/auth.js";
import timeRestriction from "../middleware/restrictions.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", timeRestriction, login);
router.post("/verifyOtp", verifyOtp);
router.get("/getallusers", getallusers);
router.patch("/update/:id", auth, updateprofile);
router.get("/loginHistory", auth, getLoginHistory);
router.post("/forgot-password", forgetPassword);
router.get("/reset-password/:id/:token", reset);
router.post("/reset-password/:id/:token", resetPassword);
router.post("/validate-otp", validateOtp);
router.post("/sendOtpEmail", sendOtpEmail);
router.post("/sendOtpPhone", sendOtpPhone);
router.post("/verifyOtpLanguage", verifyOtpLanguage);

export default router;
