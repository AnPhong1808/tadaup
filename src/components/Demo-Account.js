import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import avatar from './assets/avatar.gif'; // Keep the avatar image
import './Report.css'; // Import CSS for styling

const DemoAccount = ({ userID, onClose }) => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username.trim()) {
      setError("Please enter a valid name.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://admin.tducoin.com/api/webappuser/tradingaccount", {
        method: "POST",
        headers: {
          "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userID,
          name: username,
          accountMT5: `demo-${userID}`,
          passwordMT5: `demo-${userID}`,
          addressServer: "demoserver.tadaup.com",
          balance: 20000,
          apikeyBot: "demo-apikey",
          port_id: 1111,
          status: 1
        }),
      });

      if (response.ok) {
        setSuccess(true);

        // 🔥 Cập nhật sessionStorage ngay sau khi tạo tài khoản demo
        const storedUserData = sessionStorage.getItem("userData");
        let userData = storedUserData ? JSON.parse(storedUserData) : { trading_accounts: [] };

        // Đảm bảo `trading_accounts` tồn tại và thêm tài khoản mới
        userData.trading_accounts = [
          ...userData.trading_accounts,
          {
            accountMT5: `demo-${userID}`,
            passwordMT5: `demo-${userID}`,
            addressServer: "demoserver.tadaup.com",
            balance: 20000,
            IP: "1.1.1.1",
            status: 1
          }
        ];
        userData.name = username;

        // Lưu lại vào sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(userData));

      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to create a demo account.");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="overlay">
      <div className="report-container">
        <div className="report-card">
        <button className="close-button" onClick={() => navigate('/Home')}>X</button>
          <img src={avatar} alt="Avatar" className="report-avatar" />
          {success ? (
            <div className="buyac-details">
              <p><b>Demo Account Created Successfully!!!</b></p>
              <p>You can start exploring and experiencing an effective and simple way to earn profits right now.</p>
              <button className="report-button" onClick={onClose}>Let's go!</button>
            </div>
          ) : (
            <div className="buyac-details">
              <p>Enter a username to create a demo account with <b>$20,000</b></p>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name..." 
                className="demo-input"
              />
              {error && <p className="error-message">{error}</p>}
              <button
                className="report-button" 
                onClick={handleRegister} 
                disabled={loading}
              >
                {loading ? "Creating..." : "Try Now!"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoAccount;
