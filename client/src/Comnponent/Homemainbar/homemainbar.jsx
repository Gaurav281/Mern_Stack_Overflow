// import React from 'react'
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "./Homemainbar.css";
import Questionlist from "./Questionlist";
function Homemainbar() {
  const user = useSelector((state) => state.currentuserreducer);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const questionlist = useSelector((state) => state.questionreducer);
  // console.log(questionlist)
  const checkauth = () => {
    if (user === null) {
      alert("Login or signup to ask a question");
      navigate("/Auth");
    } else {
      navigate("/Askquestion");
    }
  };

  const [top_que, all_que, ask_que, Load, que] = t("homeMainBar").split("+");
  return (
    <div className="main-bar">
      <div className="main-bar-header">
        {location.pathname === "/" ? <h1>{top_que}</h1> : <h1>{all_que}</h1>}
        <button className="ask-btn" onClick={checkauth}>
          {ask_que}
        </button>
      </div>
      <div>
        {questionlist.data === null ? (
          <h1>{Load}</h1>
        ) : (
          <>
            <p>
              {questionlist.data?.length}
              {que}
            </p>
            <Questionlist questionlist={questionlist.data} />
          </>
        )}
      </div>
    </div>
  );
}

export default Homemainbar;
