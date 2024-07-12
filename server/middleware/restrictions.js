// middleware/restrictions.js
import { detect } from "detect-browser";

const timeRestriction = (req, res, next) => {
  const browser = detect(req.headers["user-agent"]);
  const device = browser.type;
  const loginTime = new Date();

  if (
    device === "mobile" &&
    !(loginTime.getHours() >= 10 && loginTime.getHours() <= 13)
  ) {
    return res
      .status(403)
      .json({
        message: "Access restricted to 10 AM - 1 PM for mobile devices",
      });
  }
  next();
};

export default timeRestriction;
