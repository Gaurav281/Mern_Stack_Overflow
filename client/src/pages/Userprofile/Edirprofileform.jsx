/* eslint-disable react/prop-types */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateprofile } from "../../action/users";
import "./Userprofile.css";
const Edirprofileform = ({ currentuser, setswitch }) => {
  const { t } = useTranslation();
  const edit_form_data = t("edit_form").split("+");
  const [edit_profile, Public, Display, About, Tags, cancel, save] =
    edit_form_data;

  const [name, setname] = useState(currentuser?.result?.name);
  const [about, setabout] = useState(currentuser?.result?.about);
  const [tags, settags] = useState([]);
  const dispatch = useDispatch();

  const handlesubmit = (e) => {
    e.preventDefault();
    if (tags[0] === "" || tags.length === 0) {
      alert("update tags field");
    } else {
      dispatch(updateprofile(currentuser?.result?._id, { name, about, tags }));
    }
    setswitch(false);
  };
  return (
    <div>
      <h1 className="edit-profile-title">{edit_profile}</h1>
      <h2 className="edit-profile-title-2">{Public}</h2>
      <form className="edit-profile-form" onSubmit={handlesubmit}>
        <label htmlFor="name">
          <h3>{Display}</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
        </label>
        <label htmlFor="about">
          <h3>{About}</h3>
          <textarea
            name=""
            id="about"
            cols="30"
            rows="10"
            value={about}
            onChange={(e) => setabout(e.target.value)}
          ></textarea>
        </label>
        <label htmlFor="tags">
          <h3>{Tags}</h3>
          {/* <p>{Tags}</p> */}
          <input
            type="text"
            id="tags"
            onChange={(e) => settags(e.target.value.split(" "))}
          />
        </label>
        <br />
        <input type="submit" value={save} className="user-submit-btn" />
        <button
          type="button"
          className="user-cancel-btn"
          onClick={() => setswitch(false)}
        >
          {cancel}
        </button>
      </form>
    </div>
  );
};

export default Edirprofileform;
