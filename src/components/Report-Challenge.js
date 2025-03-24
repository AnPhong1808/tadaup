import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from './assets/avatar.gif'; // Đường dẫn đến ảnh avatar
import './Report.css'; // Import CSS riêng
import targetIcon from '../components/assets/icons/target.png'; // Đảm bảo đường dẫn đúng

const Report = ({ userID, activeAccount, author, price, walletAC, disccount, amount, onBuyAC, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Trạng thái chờ API
  const [registered, setRegistered] = useState(false); // Trạng thái đăng ký thành công
  const [responseData, setResponseData] = useState(null); // Dữ liệu API trả về
  const [error, setError] = useState(null); // Trạng thái lỗi

  return (
    <>
      <div className="overlay"></div>
      <div className="report-container">
        <div className="report-card">
          <button className="close-button" onClick={() => navigate('/Home')}>X</button>
          <img src={avatar} alt="Avatar" className="report-avatar" />

          <div className="report-details">
            <p><b>Coming Soon!!!</b></p>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <p className="error-message">{error}</p>}

          <button className="report-button" onClick={() => navigate('/Home')}>
              {loading ? "Processing..." : "Back Home"}
            </button>
        </div>
      </div>
    </>
  );
};

export default Report;
