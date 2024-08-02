import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { setcurrentuser } from "./action/currentuser";
import { fetchallquestion } from "./action/question";
import { fetchallusers } from "./action/users";
import AlertModal from "./AlertModal";
import Allroutes from "./Allroutes";
import "./App.css";
import Navbar from "./Comnponent/Navbar/navbar";
import i18n from "./i18n";
function App() {
  const dispatch = useDispatch();
  const [isAccessRestricted, setIsAccessRestricted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const checkAccessTime = () => {
    const currentHour = new Date().getHours();
    const isAccessTime = currentHour >= 10 && currentHour < 13; // 10 A.M. to 1 P.M.

    if (!isAccessTime && isMobile) {
      setIsAccessRestricted(true);
      setShowAlert(true); // Show the custom alert
    } else {
      setIsAccessRestricted(false);
      setShowAlert(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkAccessTime();

    // Check every minute (60000 ms)
    const intervalId = setInterval(() => {
      checkAccessTime();
    }, 60000);

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, []);

  let target_lang = localStorage.getItem("i18nextLng");
  if (target_lang !== null) {
    i18n.changeLanguage(target_lang);
    dispatch(fetchallquestion("en", target_lang));
    dispatch(fetchallusers("en", target_lang));
  }
  // const navigate = useNavigate();
  var user = useSelector((state) => state.currentUserReducer);
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    // navigate('/')
    dispatch(setcurrentuser(null));
  };
  const token = user?.token;
  if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < new Date().getTime()) {
      handleLogout();
    }
  }

  const [slidein, setslidein] = useState(true);
  useEffect(() => {
    dispatch(fetchallusers());
    dispatch(fetchallquestion());
  }, [dispatch]);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setslidein(false);
    }
  }, []);
  const handleslidein = () => {
    if (window.innerWidth <= 768) {
      setslidein((state) => !state);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  if (isAccessRestricted) {
    return (
      <div className="App">
        <p>
          Access to this website is restricted for mobile devices outside 10 AM
          - 1 PM. Please check back during the allowed hours.
        </p>
        {showAlert && (
          <AlertModal
            message="Access this website in mobile devices between 10 AM - 1 PM Only."
            onClose={handleAlertClose}
          />
        )}
      </div>
    );
  }

  return (
    <div className="App" lang="hi">
      <Router>
        <Navbar handleslidein={handleslidein} />
        <Allroutes slidein={slidein} handleslidein={handleslidein} />
      </Router>
    </div>
  );
}

export default App;
