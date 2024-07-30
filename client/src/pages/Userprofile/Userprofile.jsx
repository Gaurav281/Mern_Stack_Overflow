/* eslint-disable react/prop-types */
import { faBirthdayCake, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Avatar from "../../Comnponent/Avatar/Avatar";
import Leftsidebar from "../../Comnponent/Leftsidebar/Leftsidebar";
import Editprofileform from "./Edirprofileform";
import Profilebio from "./Profilebio";

const Userprofile = ({ slidein }) => {
  const { t } = useTranslation();

  const { id } = useParams();
  const [Switch, setswitch] = useState(false);

  const users = useSelector((state) => state.usersreducer);
  const currentprofile = users.find((user) => user._id === id);
  const currentuser = useSelector((state) => state.currentuserreducer);

  if (!currentprofile) {
    return (
      <div className="home-container-1">
        <Leftsidebar slidein={slidein} />
        <div className="home-container-2">
          <section>
            <h1>User not found</h1>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container-1">
      <Leftsidebar slidein={slidein} />
      <div className="home-container-2">
        <section>
          <div className="user-details-container">
            <div className="user-details">
              <Avatar
                backgroundColor="purple"
                color="white"
                fontSize="50px"
                px="40px"
                py="30px"
              >
                {currentprofile.name.charAt(0).toUpperCase()}
              </Avatar>
              <div className="user-name">
                <h1>{currentprofile.name}</h1>
                <p>
                  <FontAwesomeIcon icon={faBirthdayCake} /> {t("joined")}{" "}
                  {moment(currentprofile.joinedon).fromNow()}
                </p>
              </div>
            </div>
            {currentuser?.result?._id === id && (
              <button
                className="edit-profile-btn"
                type="button"
                onClick={() => setswitch(true)}
              >
                <FontAwesomeIcon icon={faPen} />
                {t("edit")}
              </button>
            )}
          </div>
          <>
            {Switch ? (
              <Editprofileform
                currentuser={currentuser}
                setswitch={setswitch}
              />
            ) : (
              <Profilebio currentprofile={currentprofile} />
            )}
          </>
        </section>
      </div>
    </div>
  );
};

export default Userprofile;
