import axios from "axios";
import { useEffect, useState } from "react";
import "./LoginHistory.css"; // Import your CSS file

const LoginHistory = () => {
  const [loginHistory, setLoginHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("Profile"))?.token;
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get("/user/loginHistory", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched login history:", response.data);
        setLoginHistory(response.data);
      } catch (error) {
        console.error("Error fetching login history:", error);
        setError(error.message);
      }
    };

    fetchLoginHistory();
  }, []);

  return (
    <div className="login-history-container">
      <h2>Login History</h2>
      {error ? (
        <p>{error}</p>
      ) : (
        <div className="grid-container">
          {loginHistory.length > 0 ? (
            loginHistory.map((entry) => (
              <div className="card" key={entry._id}>
                <h3>Login Details</h3>
                <p>
                  <strong>IP:</strong> {entry.ip}
                </p>
                <p>
                  <strong>Device:</strong> {entry.device}
                </p>
                <p>
                  <strong>Browser:</strong> {entry.browser}
                </p>
                <p>
                  <strong>OS:</strong> {entry.os}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(entry.loginTime).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p>No login history available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginHistory;
