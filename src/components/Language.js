import React, { useState } from 'react';
import usaIcon from '../components/assets/icons/usa.png';
import chinaIcon from '../components/assets/icons/china.png';
import "./Setting-Menu.css";
import "./Setting-Format.css";

function Language({ onBack }) {
  const [selectedLanguage, setSelectedLanguage] = useState("USA"); // Mặc định chọn USA

  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="menu-container">
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => onBack}>
          <img src={usaIcon} alt="icon" className="icon-left" />
          <span>USA</span>
          <div className="icon-right">
            <div className={`language-radio-circle ${selectedLanguage === "USA" ? "language-selected" : ""}`}></div>
          </div>
        </button>
      </div>

      {/* Đường phân chia */}
      <div className="divider"></div>

      <div className="menu-item">
        {/* Phần Button */}
        <button className="menu-button" onClick={onBack}>
          <img src={chinaIcon} alt="icon" className="icon-left" />
          <span>中文</span>
          <div className="icon-right">
            <div className={`language-radio-circle ${selectedLanguage === "中文" ? "language-selected" : ""}`}></div>
          </div>
        </button>
      </div>
    </div>
  );
}

export default Language;
