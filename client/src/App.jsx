import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { setcurrentuser } from "./action/currentuser";
import { fetchallquestion } from "./action/question";
import { fetchallusers } from "./action/users";
import Allroutes from "./Allroutes";
import "./App.css";
import Navbar from "./Comnponent/Navbar/navbar";
import i18n from "./i18n";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAccessTime = () => {
      const currentHour = new Date().getHours();
      const isAccessTime = currentHour >= 10 && currentHour < 13; // 10 A.M. to 1 P.M.

      if (!isAccessTime && isMobile) {
        alert("You cannot access the website at this time.");
      }
    };

    checkAccessTime();
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
