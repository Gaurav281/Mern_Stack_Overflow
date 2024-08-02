import { detect } from "detect-browser";

const timeRestriction = (req, res, next) => {
  const browser = detect(req.headers["user-agent"]);
  const device = browser ? browser.type : null;
  const currentHour = new Date().getHours();

  // Check if the device is mobile and if the current time is outside the allowed window
  if (device === "mobile" && !(currentHour >= 10 && currentHour <= 13)) {
    return res.status(403).json({
      message:
        "Access the website in mobile devices between 10 AM - 1 PM Only.",
    });
  }

  next();
};

export default timeRestriction;
