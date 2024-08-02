import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import timeRestriction from "./middleware/timeRestriction.js";
import answerroutes from "./routes/answer.js";
import questionroutes from "./routes/question.js";
import userroutes from "./routes/user.js";
const app = express();

app.set("view engine", "ejs");
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(timeRestriction);

app.use("/user", userroutes);
app.use("/questions", questionroutes);
app.use("/answer", answerroutes);

app.get("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  res.render("index", { id, token, status: "not_verified", email: "" });
});

app.get("/", (req, res) => {
  res.send("mern Server is running perfect");
});

const PORT = process.env.PORT || 5000;
const database_url = process.env.MONGODB_URL;

mongoose
  .connect(database_url)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`mern server running on port ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
