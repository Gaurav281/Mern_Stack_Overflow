import express from "express";
import { login, signup, verifyOtp } from "../controller/auth.js";
import {
  getallusers,
  getLoginHistory,
  updateprofile,
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

export default router;
