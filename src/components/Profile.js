import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import nextIcon from '../components/assets/icons/next.png'; // Đảm bảo đường dẫn đúng
import userIcon from '../components/assets/icons/user.png'; // Đảm bảo đường dẫn đúng
import contactIcon from '../components/assets/icons/contact.png'; // Đảm bảo đường dẫn đúng
import idIcon from '../components/assets/icons/id.png'; // Đảm bảo đường dẫn đúng
import emailIcon from '../components/assets/icons/email.png'; // Đảm bảo đường dẫn đúng
import telegramIcon from '../components/assets/icons/telegram.png'; // Đảm bảo đường dẫn đúng
import "./Setting-Menu.css";

function SettingMenu({ user, onBack }) {
  const handleNavigate = (menu) => {
    onMenuSelect(menu); // Gọi hàm để thay đổi nội dung hiển thị
  };

  return (
    <div className="menu-container">
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => handleNavigate("profile")}>
          <img src={userIcon} alt="icon" className="icon-left" />
          <span>{user.name}</span>
        </button>
      </div>
      {/* Đường phân chia */}
      <div className="divider"></div>
      {/* Phần Button */}
      <div className="menu-item">
        {/* Lịch sử nạp rút */}
        <button className="menu-button" onClick={() => handleNavigate("history")}>
          <img src={contactIcon} alt="icon" className="icon-left" />
          <span>{user.phone}</span>
        </button>
      </div>
      <div className="divider"></div>
      {/* Phần Button */}
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => handleNavigate("language")}>
          <img src={emailIcon} alt="icon" className="icon-left" />
          <span>{user.email}</span>
        </button>
      </div>
      <div className="divider"></div>
      {/* Phần Button */}
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => handleNavigate("terms")}>
          <img src={idIcon} alt="icon" className="icon-left" />
          <span>{user.userID}</span>
        </button>
      </div>

      <div className="divider"></div>
      {/* Phần Button */}
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => handleNavigate("about")}>
          <img src={telegramIcon} alt="icon" className="icon-left" />
          <span>{user.telegramNick}</span>
        </button>
      </div>

    </div>
  );
}

export default SettingMenu;
