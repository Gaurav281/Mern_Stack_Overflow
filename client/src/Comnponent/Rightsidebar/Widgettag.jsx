import { useTranslation } from "react-i18next";

function Widgettag() {
  const { t } = useTranslation();
  const tags = t("widgetTags").split(",");

  // const tags = [
  //     "c",
  //     "css",
  //     "express",
  //     "firebase",
  //     "html",
  //     "java",
  //     "javascript",
  //     "mern",
  //     "mongodb",
  //     "mysql",
  //     "next.js",
  //     "node.js",
  //     "php",
  //     "python",
  //     "reactjs",
  // ]
  return (
    <div className="widget-tags">
      <h3>{t("widget1")}</h3>
      <div className="widget-tags-div">
        {tags.map((tag) => (
          <p key={tag}>{tag}</p>
        ))}
      </div>
    </div>
  );
}

export default Widgettag;
