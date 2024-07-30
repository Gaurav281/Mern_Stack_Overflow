/* eslint-disable react/prop-types */
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { deleteanswer } from "../../action/question";
import Avatar from "../../Comnponent/Avatar/Avatar";

const Displayanswer = ({ question, handleshare }) => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.currentuserreducer);
  const { id } = useParams();
  const dispatch = useDispatch();
  const handledelete = (answerid, noofanswers) => {
    dispatch(deleteanswer(id, answerid, noofanswers - 1));
  };
  return (
    <div>
      {question.answer.map((ans) => (
        <div className="display-ans" key={ans._id}>
          <p>{ans.answerbody}</p>
          <div className="question-actions-user">
            <div>
              <button type="button" onClick={handleshare}>
                {t("share")}
              </button>
              {user?.result?._id === ans?.userid && (
                <button
                  type="button"
                  onClick={() => handledelete(ans._id, question.noofanswers)}
                >
                  {t("delete")}
                </button>
              )}
            </div>
            <div>
              <p>
                {t("answered")} {moment(ans.answeredon).fromNow()}
              </p>
              <Link
                to={`Users/${ans.userid}`}
                className="user-limk"
                style={{ color: "#0086d8" }}
              >
                <Avatar
                  backgroundColor="lightgreen"
                  px="2px"
                  py="2px"
                  borderRadius="2px"
                >
                  {ans?.useranswered?.trim()?.charAt(0).toUpperCase()}
                </Avatar>
                <div>{ans.useranswered}</div>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Displayanswer;
