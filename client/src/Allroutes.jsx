import { Route, Routes } from "react-router-dom";
import Askquestion from "./pages/Askquestion/Askquestion";
import Auth from "./pages/Auth/Auth";
import Home from "./pages/Home/Home";
import LoginHistory from "./pages/LoginHistory/LoginHistory";
import Displayquestion from "./pages/Question/Displayquestion";
import Question from "./pages/Question/Question";
import Tags from "./pages/Tags/Tags";
import Userprofile from "./pages/Userprofile/Userprofile";
import Users from "./pages/Users/Users";

function Allroutes({ slidein, handleslidein }) {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home slidein={slidein} handleslidein={handleslidein} />}
      />
      <Route path="/Askquestion" element={<Askquestion />} />
      <Route path="/Auth" element={<Auth />} />
      <Route
        path="/Question"
        element={<Question slidein={slidein} handleslidein={handleslidein} />}
      />
      <Route
        path="/Question/:id"
        element={
          <Displayquestion slidein={slidein} handleslidein={handleslidein} />
        }
      />
      <Route
        path="/Tags"
        element={<Tags slidein={slidein} handleslidein={handleslidein} />}
      />
      <Route
        path="/Users"
        element={<Users slidein={slidein} handleslidein={handleslidein} />}
      />
      <Route
        path="/Users/:id"
        element={
          <Userprofile slidein={slidein} handleslidein={handleslidein} />
        }
      />
      <Route path="/History" element={<LoginHistory />} />
    </Routes>
  );
}

export default Allroutes;
