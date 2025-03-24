import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import coinIcon from "./assets/icons/coin-header.png";
import menuIcon from "./assets/icons/menu.png";
import chatIcon from "./assets/icons/chat.png";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ userId }) => {
  const [walletAC, setWalletAC] = useState(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
    return storedUserData.wallet_AC || 0;
  });

  // Hàm cập nhật số dư
  const updateWalletAC = () => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
    setWalletAC(storedUserData.wallet_AC || 0);
  };

  useEffect(() => {
    // Lắng nghe sự kiện tùy chỉnh để cập nhật ngay lập tức
    const handleWalletUpdate = () => updateWalletAC();

    window.addEventListener("walletUpdated", handleWalletUpdate);

    // Kiểm tra và cập nhật ngay khi app khởi động
    updateWalletAC();

    return () => {
      window.removeEventListener("walletUpdated", handleWalletUpdate);
    };
  }, []);

  // Hàm đóng WebApp để quay về giao diện chính của Telegram
  const handleCloseWebApp = () => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.close();
    } else {
      console.warn("Telegram WebApp API không khả dụng.");
    }
  };

  return (
    <header className="header">
      <div className="left-section">
        <Link to={`/setting/${userId}`} className="menusetting-container">
          <img src={menuIcon} alt="Menu" className="menu-icon" />
        </Link>
        <div className="coins">
          <img src={coinIcon} alt="Coin" className="coin-icon" />
          <span>{walletAC}</span>
        </div>
      </div>
      <div className="chat-container">
        <img 
          src={chatIcon} 
          alt="Chat" 
          className="chat-icon" 
          onClick={handleCloseWebApp} 
        />
      </div>
    </header>
  );
};

export default Header;
