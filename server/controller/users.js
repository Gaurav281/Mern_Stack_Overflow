import bcrypt from "bcryptjs";
import crypto from "crypto";
import dotenv from "dotenv";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import User from "../models/auth.js";

dotenv.config();

export const getallusers = async (req, res) => {
  try {
    const allusers = await User.find();
    const alluserdetails = allusers.map((user) => ({
      _id: user._id,
      name: user.name,
      about: user.about,
      tags: user.tags,
      joinedon: user.joinedon,
    }));
    res.status(200).json(alluserdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("User unavailable");
  }
  try {
    const updatedProfile = await User.findByIdAndUpdate(
      _id,
      { $set: { name, about, tags } },
      { new: true }
    );
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    const userId = req.userid;
    const user = await User.findById(userId).select("loginHistory");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.loginHistory);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP
    console.log(`${otp}+${link}`);
    // Save OTP to user document
    oldUser.otp = otp;
    oldUser.otpExpiry = Date.now() + 300000; // Set expiry time to 5 minutes
    await oldUser.save();

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: oldUser.email,
      subject: "Password Reset",
      text: `Your OTP for password reset is ${otp}\n\nYou can also reset your password using the following link: ${link}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: "Error sending OTP email" });
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json({
          status: "OTP and reset link sent to email",
          userId: oldUser._id,
          token: token,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const validateOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "User Not Exists!!" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ status: "Invalid OTP" });
    }
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ status: "OTP Expired" });
    }
    res.status(200).json({ status: "OTP Verified" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const reset = async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", {
      email: verify.email,
      status: "Not Verified",
      id,
      token,
    });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  // console.log("newPassword:", newPassword); // Log newPassword
  // console.log("confirmPassword:", confirmPassword); // Log confirmPassword

  if (!newPassword || !confirmPassword) {
    return res.json({ status: "Passwords cannot be empty!" });
  }

  if (newPassword !== confirmPassword) {
    return res.json({ status: "Passwords do not match!" });
  }

  try {
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }

    const secret = process.env.JWT_SECRET + oldUser.password;
    const verify = jwt.verify(token, secret);

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    oldUser.password = encryptedPassword;
    await oldUser.save();

    res.render("index", { email: verify.email, status: "verified", id, token });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
};

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

export const sendOtpEmail = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otp);
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }
    user.otp = otp;
    user.otpExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for Language Change",
      text: `Your OTP for changing language is ${otp}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent:", info.response);
        res.status(200).json({ message: "OTP sent to email" });
      }
    });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ message: "Error sending OTP email" });
  }
};

export const sendOtpPhone = async (req, res) => {
  const { phoneNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otp);
  try {
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = new User({ phoneNumber });
    }
    user.otp = otp;
    user.otpExpiry = Date.now() + 3600000; // 1 hour
    await user.save();

    // if (!user.firebaseToken) {
    //   throw new Error("User does not have a Firebase token");
    // }
    // user.firebaseToken = "6LcnoRoqAAAAANx-7mRrn_5PWqT54bGmJKvnH8Bo";
    const message = await admin.messaging().send({
      data: {
        otp,
      },
      token: user.firebaseToken,
    });

    res
      .status(200)
      .json({ message: "OTP sent to phone", messageId: message.messageId });
  } catch (error) {
    console.error("Error sending OTP phone:", error);
    res.status(500).json({ message: "Error sending OTP phone" });
  }
};

export const verifyOtpLanguage = async (req, res) => {
  const { contact, otp } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: contact }, { phoneNumber: contact }],
    });
    if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP" });
    }
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.status(200).json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Error verifying OTP" });
  }
};
