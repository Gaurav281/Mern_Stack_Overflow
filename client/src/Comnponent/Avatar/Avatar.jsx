/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useTranslation } from "react-i18next";
function Avatar({
  children,
  backgroundColor,
  px,
  py,
  color,
  borderRadius,
  fontSize,
  cursor,
}) {
  const { t } = useTranslation();
  const style = {
    backgroundColor,
    padding: `${py} ${px}`,
    color: color || "black",
    borderRadius,
    fontSize,
    textAlign: "center",
    cursor: cursor || null,
    textDecoration: "none",
  };
  return <div style={style}>{children}</div>;
}

export default Avatar;
