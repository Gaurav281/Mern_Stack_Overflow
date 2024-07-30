/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setcurrentuser } from "../../action/currentuser";
import { fetchallquestion } from "../../action/question";
import { fetchallusers } from "../../action/users";
import { verifyOtpLanguage } from "../../api";
import bars from "../../assets/bars-solid.svg";
import logo from "../../assets/logo.png";
import search from "../../assets/search-solid.svg";
import i18n from "../../i18n";
import Avatar from "../Avatar/Avatar";
import PopUpWindow from "../PopUpWindow/PopUpWindow";
import "./navbar.css";

function Navbar({ handleslidein }) {
  const { t } = useTranslation();

  const User = useSelector((state) => state.currentuserreducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [language, setLanguage] = useState(
    localStorage.getItem("i18nextLng") || "default"
  );
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handlelogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
    dispatch(setcurrentuser(null));
    localStorage.removeItem("Profile");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const token = User?.token;
    if (token) {
      const decodedtoken = jwtDecode(token);
      if (decodedtoken.exp * 1000 < new Date().getTime()) {
        handlelogout();
      }
    }
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
  }, [dispatch]);

  const handleLanguageChange = async (e) => {
    const selectedLanguage = e.target.value;
    if (selectedLanguage === "default") return;

    if (!User) {
      navigate("/Auth");
      return;
    }

    setSelectedLanguage(selectedLanguage);
    setShowPopUp(true);
  };

  const applyLanguageChange = async (otp) => {
    const profile = JSON.parse(localStorage.getItem("Profile"));
    if (!profile) return;

    const email = profile?.result?.email;
    const existingPhoneNumber = profile?.result?.phoneNumber;

    if (selectedLanguage) {
      if (await verifyOtpLanguage(email, otp)) {
        updateLanguage(selectedLanguage);
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } //else {
    //   const contact = existingPhoneNumber || phoneNumber;
    //   if (await verifyOtpLanguage(contact, otp)) {
    //     updateLanguage(selectedLanguage);
    //   } else {
    //     alert("Invalid OTP. Please try again.");
    //   }
    // }
    setShowPopUp(false);
  };

  const updateLanguage = (selectedLanguage) => {
    localStorage.setItem("i18nextLng", selectedLanguage);
    i18n.changeLanguage(selectedLanguage);

    switch (selectedLanguage) {
      case "hi":
        document.body.style.backgroundColor = "blue";
        break;
      case "pa":
        document.body.style.backgroundColor = "green";
        break;
      case "fr":
        document.body.style.backgroundColor = "yellow";
        break;
      default:
        document.body.style.backgroundColor = "white";
        break;
    }

    const source_lang = i18n.language;
    dispatch(fetchallquestion(source_lang, selectedLanguage));
    dispatch(fetchallusers(source_lang, selectedLanguage));
  };

  return (
    <nav className="main-nav">
      <div className="navbar">
        <button className="slide-in-icon" onClick={() => handleslidein()}>
          <img src={bars} alt="bars" width="15" />
        </button>
        <div className="navbar-1">
          <Link to="/" className="nav-item nav-logo">
            <img src={logo} alt="logo" />
          </Link>
          <Link to="/" className="nav-item nav-btn res-nav">
            {t("About", { ns: "Navbar" })}
          </Link>
          <Link to="/" className="nav-item nav-btn res-nav">
            {t("Products", { ns: "Navbar" })}
          </Link>
          <Link to="/" className="nav-item nav-btn res-nav">
            {t("For Teams", { ns: "Navbar" })}
          </Link>
          <form>
            <input type="text" placeholder={t("search...", { ns: "Navbar" })} />
            <img src={search} alt="search" width="18" className="search-icon" />
          </form>
          <select
            className="form-select w-auto"
            defaultValue={localStorage.getItem("i18nextLng")}
            style={{ appearance: "none" }}
            aria-label="Default select example"
            onChange={handleLanguageChange}
          >
            <option value="default">{t("lang")}</option>
            <option value="en">{t("en")}</option>
            <option value="hi">{t("hi")}</option>
            <option value="pa">{t("pa")}</option>
            <option value="fr">{t("fr")}</option>
            <option value="bn">{t("bn")}</option>
          </select>
        </div>
        <div className="navbar-2">
          {User === null ? (
            <Link to="/Auth" className="nav-item nav-links">
              {t("Log in", { ns: "Navbar" })}
            </Link>
          ) : (
            <>
              <Avatar
                backgroundColor="#009dff"
                px="10px"
                py="7px"
                borderRadius="50%"
                color="white"
              >
                <Link
                  to={`/Users/${User?.result?._id}`}
                  style={{ color: "white", textDecoration: "none" }}
                >
                  {User?.result?.name?.charAt(0).toUpperCase()}
                </Link>
              </Avatar>
              <button className="nav-item nav-links" onClick={handlelogout}>
                {t("Log out", { ns: "Navbar" })}
              </button>
              <Link to="/History" className="nav-item nav-links">
                {t("Login History", { ns: "Navbar" })}
              </Link>
            </>
          )}
        </div>
      </div>
      {showPopUp && (
        <PopUpWindow
          selectedLanguage={selectedLanguage}
          applyLanguageChange={applyLanguageChange}
          setShowPopUp={setShowPopUp} // Pass the setShowPopUp function to PopUpWindow
        />
      )}
    </nav>
  );
}

export default Navbar;
