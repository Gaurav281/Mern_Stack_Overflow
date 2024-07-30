import * as api from "../api";
import { setcurrentuser } from "./currentuser";
import { translateapi } from "./translate";
import { fetchallusers } from "./users";

export const askquestion = (questionData, navigate) => async (dispatch) => {
  try {
    const { data } = await api.postquestion(questionData);
    // dispatch({type:"POST_QUESTION",payload:data})
    // console.log(data);

    const user = JSON.parse(localStorage.getItem("Profile"));
    // console.log(user);
    // dispatch({type:'AUTH',data});
    const new_user = { result: data.result, token: user["token"] };
    dispatch({ type: "AUTH", data: new_user });
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))));
    dispatch(fetchallusers("en", localStorage.getItem("i18nextLng")));
    dispatch(fetchallquestion("en", localStorage.getItem("i18nextLng")));
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const fetchallquestion =
  (source_lang, target_lang) => async (dispatch) => {
    // console.log("fetched data from server");
    try {
      const { data } = await api.getallquestions();
      if (
        source_lang !== undefined &&
        target_lang !== undefined &&
        target_lang !== "en"
      ) {
        const updated_data = await Promise.all(
          data.map(async (question) => {
            let text =
              (question.questionTitle || "") +
              "+" +
              (question.questionBody || "") +
              "+" +
              (question.userPosted || "") +
              "+" +
              (question.questionTags ? question.questionTags.join("+") : "");
            text = text.replaceAll("&", "%26");
            text = text.replaceAll("+", "%2B");
            text = text.replaceAll("=", "%3D");
            const test = await translateapi(text, "en", target_lang);

            const translated_data = test["translated Text"];
            if (translated_data !== undefined) {
              const [que_title, que_body, user_posted, ...ques_tags] =
                translated_data?.split("+");

              const answers = await Promise.all(
                question.answer.map(async (answer) => {
                  let ans_text =
                    (answer.answerBody || "") +
                    " + " +
                    (answer.userAnswered || "");
                  ans_text = ans_text.replaceAll("&", "%26");
                  ans_text = ans_text.replaceAll("+", "%2B");
                  ans_text = ans_text.replaceAll("=", "%3D");

                  const ans_test = await translateapi(
                    ans_text,
                    "en",
                    target_lang
                  );
                  const translated_ans = ans_test["translated Text"];
                  const [ans_body, ans_userAnswered] =
                    translated_ans?.split("+");
                  const new_ans = {
                    ...answer,
                    answerBody: ans_body,
                    userAnswered: ans_userAnswered,
                  };
                  return new_ans;
                })
              );

              const new_que = {
                ...question,
                questionTitle: que_title,
                questionBody: que_body,
                questionTags: ques_tags,
                userPosted: user_posted,
                answer: answers,
              };

              return new_que;
            }
          })
        );
        if (updated_data !== undefined && updated_data[0] !== undefined) {
          dispatch({ type: "FETCH_ALL_QUESTIONS", payload: updated_data });
          return;
        }
      }
      dispatch({ type: "FETCH_ALL_QUESTIONS", payload: data });
    } catch (error) {
      console.log(error);
    }
  };

export const deletequestion = (id, navigate) => async (dispatch) => {
  try {
    await api.deletequestion(id);
    dispatch(fetchallquestion("en", localStorage.getItem("i18nextLng")));
    dispatch(fetchallusers("en", localStorage.getItem("i18nextLng")));
    navigate("/");
  } catch (error) {
    console.log(error);
  }
};

export const postanswer = (answerdata) => async (dispatch) => {
  try {
    const { id, noofanswers, answerbody, useranswered } = answerdata;
    const { data } = await api.postanswer(
      id,
      noofanswers,
      answerbody,
      useranswered
    );
    dispatch({ type: "POST_ANSWER", payload: data });
    // dispatch(fetchallquestion());
    dispatch(fetchallquestion("en", localStorage.getItem("i18nextLng")));
    dispatch(fetchallusers("en", localStorage.getItem("i18nextLng")));
  } catch (error) {
    console.log(error);
  }
};

export const deleteanswer = (id, answerid, noofanswers) => async (dispatch) => {
  try {
    await api.deleteanswer(id, answerid, noofanswers);
    dispatch(fetchallquestion("en", localStorage.getItem("i18nextLng")));
    dispatch(fetchallusers("en", localStorage.getItem("i18nextLng")));
  } catch (error) {
    console.log(error);
  }
};

export const votequestion = (id, value) => async (dispatch) => {
  try {
    await api.votequestion(id, value);
    // dispatch(fetchallquestion())
    dispatch(fetchallquestion("en", localStorage.getItem("i18nextLng")));
    dispatch(fetchallusers("en", localStorage.getItem("i18nextLng")));
  } catch (error) {
    console.log(error);
  }
};
