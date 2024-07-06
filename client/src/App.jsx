import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Allroutes from "./Allroutes";
import "./App.css";
import Navbar from "./Comnponent/Navbar/navbar";
import { fetchallquestion } from "./action/question";
import { fetchallusers } from "./action/users";
function App() {
  const [slidein, setslidein] = useState(true);
  const dispatch = useDispatch();
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
    <div className="App">
      <Router>
        <Navbar handleslidein={handleslidein} />
        <Allroutes slidein={slidein} handleslidein={handleslidein} />
      </Router>
    </div>
  );
}

export default App;
