import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import nextIcon from '../components/assets/icons/next.png'; // Đảm bảo đường dẫn đúng
import hosoIcon from '../components/assets/icons/setting-hoso.png'; // Đảm bảo đường dẫn đúng
import lichsunaprutIcon from '../components/assets/icons/setting-lichsunaprut.png'; // Đảm bảo đường dẫn đúng
import dieukhoansudungIcon from '../components/assets/icons/setting-dieukhoansudung.png'; // Đảm bảo đường dẫn đúng
import ngonnguIcon from '../components/assets/icons/setting-ngonngu.png'; // Đảm bảo đường dẫn đúng
import infoIcon from '../components/assets/icons/info.png'; // Đảm bảo đường dẫn đúng
import "./Setting-Menu.css";

function SettingMenu({ onMenuSelect }) {
  const handleNavigate = (menu) => {
    onMenuSelect(menu); // Gọi hàm để thay đổi nội dung hiển thị
  };

  return (
    <div className="menu-container">
      {/* Phần Button */}
      <div className="menu-item">
        {/* Lịch sử nạp rút */}
        <button className="menu-button" onClick={() => handleNavigate("affiliate")}>
          <img src={lichsunaprutIcon} alt="icon" className="icon-left" />
          <span>Affiliate Profit</span>
          <div className="icon-right">
            <img src={nextIcon} alt="arrow" className="arrow-icon" />
          </div>
        </button>
      </div>
      <div className="divider"></div>
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => handleNavigate("profile")}>
          <img src={hosoIcon} alt="icon" className="icon-left" />
          <span>Profile</span>
          <div className="icon-right">
            <img src={nextIcon} alt="arrow" className="arrow-icon" />
          </div>
        </button>
      </div>
      {/* Đường phân chia */}
      <div className="divider"></div>     
      {/* Phần Button */}
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => handleNavigate("language")}>
          <img src={ngonnguIcon} alt="icon" className="icon-left" />
          <span>Language</span>
          <div className="icon-right">
            <img src={nextIcon} alt="arrow" className="arrow-icon" />
          </div>
        </button>
      </div>
      <div className="divider"></div>
      {/* Phần Button */}
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => handleNavigate("terms")}>
          <img src={dieukhoansudungIcon} alt="icon" className="icon-left" />
          <span>Terms of use</span>
          <div className="icon-right">
            <img src={nextIcon} alt="arrow" className="arrow-icon" />
          </div>
        </button>
      </div>

      <div className="divider"></div>
      {/* Phần Button */}
      <div className="menu-item">
        {/* Button với icon và tiêu đề */}
        <button className="menu-button" onClick={() => handleNavigate("about")}>
          <img src={infoIcon} alt="icon" className="icon-left" />
          <span>About TadaUp</span>
          <div className="icon-right">
            <img src={nextIcon} alt="arrow" className="arrow-icon" />
          </div>
        </button>
      </div>

    </div>
  );
}

export default SettingMenu;
