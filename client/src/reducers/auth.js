const authreducer = (state = { data: null, loginHistory: [] }, action) => {
  switch (action.type) {
    case "AUTH":
      localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data };
    case "LOGOUT":
      localStorage.clear();
      return { ...state, data: null };
    case "FETCH_LOGIN_HISTORY":
      return { ...state, loginHistory: action.payload };
    case "RESET":
      return { ...state, data: null };
    case "VERIFY":
      localStorage.setItem("Profile", JSON.stringify({ ...action?.data }));
      return { ...state, data: action?.data };
    default:
      return state;
  }
};

export default authreducer;
