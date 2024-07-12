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
    default:
      return state;
  }
};

export default authreducer;
