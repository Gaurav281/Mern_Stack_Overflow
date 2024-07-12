import mongoose from "mongoose";
import users from "../models/auth.js";

export const getallusers = async (req, res) => {
  try {
    const allusers = await users.find();
    const alluserdetails = [];
    allusers.forEach((user) => {
      alluserdetails.push({
        _id: user._id,
        name: user.name,
        about: user.about,
        tags: user.tags,
        joinedon: user.joinedon,
      });
    });
    res.status(200).json(alluserdetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { name, about, tags } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("user unavailable");
  }
  try {
    const updateprofile = await users.findByIdAndUpdate(
      _id,
      { $set: { name: name, about: about, tags: tags } },
      { new: true }
    );
    res.status(200).json(updateprofile);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getLoginHistory = async (req, res) => {
  try {
    const userId = req.userid;
    const user = await users.findById(userId).select("loginHistory");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("Fetched login history: ", user.loginHistory);
    res.status(200).json(user.loginHistory);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
