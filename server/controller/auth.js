import bcrypt from "bcryptjs";
import { detect } from "detect-browser";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import requestIp from "request-ip";
import users from "../models/auth.js";

const formatIpAddress = (ip) => {
  // Handle IPv4 and IPv6 addresses
  if (ip === "::1") {
    return "127.0.0.1"; // Convert localhost IPv6 to IPv4
  } else if (ip.includes(":")) {
    // It's an IPv6 address, you can format it if needed
    return ip; // Return as is or add additional formatting
  }
  return ip; // Assuming it's already a valid IPv4 address
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await users.create({
      name,
      email,
      password: hashedPassword,
    });

    const browser = detect(req.headers["user-agent"]);
    if (browser.name !== "edge-chromium") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`${otp}`);
      newUser.otp = otp;
      await newUser.save();

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
        subject: "OTP for Signup",
        text: `Your OTP is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return res.status(500).json({ message: "Error sending OTP" });
        }
        return res.status(200).json({ message: "OTP sent to email" });
      });
    } else {
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res
        .status(200)
        .json({ message: "Signup successful", result: newUser, token });
    }
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const browser = detect(req.headers["user-agent"]);

    // Get IP address using request-ip
    const ip = requestIp.getClientIp(req);
    const formattedIp = formatIpAddress(ip);

    existingUser.loginHistory.push({
      ip: formattedIp,
      device: browser.type,
      browser: browser.name,
      os: browser.os,
      loginTime: new Date(),
    });

    // Implement time and browser-based restrictions
    if (
      browser.os === "Android OS" &&
      !(new Date().getHours() >= 10 && new Date().getHours() <= 13)
    ) {
      return res.status(403).json({
        message: "Access restricted to 10 AM - 1 PM for mobile devices",
      });
    }

    if (browser.name === "edge-chromium") {
      // Edge users get a token directly
      const token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      await existingUser.save();
      return res
        .status(200)
        .json({ message: "Login successful", result: existingUser, token });
    } else {
      // Non-Edge users receive an OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`${otp}`);
      existingUser.otp = otp;
      await existingUser.save();

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
        subject: "OTP for Login",
        text: `Your OTP is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return res.status(500).json({ message: "Error sending OTP" });
        }
        return res.status(200).json({ message: "OTP sent to email" });
      });
    }
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser || existingUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    existingUser.otp = null;
    await existingUser.save();

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "OTP verified successfully",
      result: existingUser,
      token,
    });
  } catch (error) {
    res.status(500).json("Something went wrong...");
  }
};

// export const getLoginHistory = async (req, res) => {
//   try {
//     const userId = req.userid;
//     const user = await users.findById(userId).select("loginHistory");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user.loginHistory);
//   } catch (error) {
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };

// export const reset = async (req, res) => {
//   const { email, pass1 } = req.body;

//   const existinguser = await users.findOne({ email });
//   try {
//     if (!existinguser) {
//       return res.status(404).send("User does not exists, Sign up first");
//     } else {
//       if (pass1.length < 5) {
//         return res
//           .status(406)
//           .send("Password should atleast 5 characters long");
//       }

//       const _id = existinguser._id;

//       const hashedPassword = await bcrypt.hash(pass1, 12);

//       await users.findByIdAndUpdate(_id, {
//         $set: { password: hashedPassword },
//       });
//     }
//     return res.status(200).send("Password Updated successfully");
//   } catch (error) {
//     console.log(error);
//     res.status(500).json("Something went wrong...");
//   }
// };
