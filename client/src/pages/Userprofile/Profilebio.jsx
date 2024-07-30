/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// import React from 'react'
import { useTranslation } from "react-i18next";

const Profilebio = ({ currentprofile }) => {
  const { t } = useTranslation();
  const profile_data = t("profile").split("+");
  const [points, badges, tags_watched, About, No_bio] = profile_data;
  return (
    <div>
      <div>
        {currentprofile?.tags.length !== 0 ? (
          <>
            <h4>{tags_watched}</h4>
            {currentprofile?.tags.map((tag) => (
              <p key={tag}>{tag}</p>
            ))}
          </>
        ) : (
          <p>0 {tags_watched}</p>
        )}
      </div>
      <div>
        {currentprofile?.about ? (
          <>
            <h4>{About}</h4>
            <p>{currentprofile?.about}</p>
          </>
        ) : (
          <p>{No_bio}</p>
        )}
      </div>
    </div>
  );
};

export default Profilebio;
