// import React, { useState } from 'react'
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { askquestion } from "../../action/question";
import "./Askquestion.css";
const Askquestion = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.currentuserreducer);

  const { t } = useTranslation();
  const ask_question_data = t("ask_question").split("+");
  // console.log(ask_question_data);
  const [
    ask,
    title,
    placeholder,
    beSpecific,
    body,
    Include,
    tags,
    addup,
    Review,
  ] = ask_question_data;

  const [questiontitle, setquestiontitle] = useState("");
  const [questionbody, setquestionbody] = useState("");
  const [questiontag, setquestiontags] = useState("");
  const handlesubmit = (e) => {
    e.preventDefault();
    if (user) {
      if (questionbody && questiontitle && questiontag) {
        dispatch(
          askquestion(
            {
              questiontitle,
              questionbody,
              questiontag,
              userposted: user.result.name,
            },
            navigate
          )
        );
        alert("you have successfuly posted a question");
      } else {
        alert("Please enter all the fields");
      }
    } else {
      alert("Login to ask question");
    }
  };
  const handleenter = (e) => {
    if (e.code === "Enter") {
      setquestionbody(questionbody + "\n");
    }
  };

  return (
    <div className="ask-question">
      <div className="ask-ques-container">
        <h1>{ask}</h1>
        <form onSubmit={handlesubmit}>
          <div className="ask-form-container">
            <label htmlFor="ask-ques-title">
              <h4>{title}</h4>
              <p>{beSpecific}</p>
              <input
                type="text"
                id="ask-ques-title"
                onChange={(e) => {
                  setquestiontitle(e.target.value);
                }}
                placeholder={placeholder}
              />
            </label>
            <label htmlFor="ask-ques-body">
              <h4>{body}</h4>
              <p>{Include}</p>
              <textarea
                name=""
                id="ask-ques-body"
                onChange={(e) => {
                  setquestionbody(e.target.value);
                }}
                cols="30"
                rows="10"
                onKeyDown={handleenter}
              ></textarea>
            </label>
            <label htmlFor="ask-ques-tags">
              <h4>{tags}</h4>
              <p>{addup}</p>
              <input
                type="text"
                id="ask-ques-tags"
                onChange={(e) => {
                  setquestiontags(e.target.value.split(" "));
                }}
                placeholder="e.g. (xml typescript wordpress"
              />
            </label>
          </div>
          <input type="submit" value={Review} className="review-btn" />
        </form>
      </div>
    </div>
  );
};

export default Askquestion;
