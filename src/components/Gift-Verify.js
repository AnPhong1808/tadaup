import React from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from './assets/avatar.gif'; // Đường dẫn đến ảnh avatar
import './Gift-Verify.css'; // Sử dụng file CSS mới

const GiftVerify = ({ result }) => {
  const navigate = useNavigate();

  // Hàm xử lý khi nhấn nút "Quay lại trang chủ"
  const handleBackToMenu = () => {
    navigate('/home'); // Điều hướng về trang chủ
  };

  return (
    <>
      <div className="gift-verify-container">
        <div className="gift-verify-card">
          <img src={avatar} alt="Avatar" className="gift-verify-avatar" />
          <div className="gift-verify-details">
            <p className="gift-verify-message">
              {result?.status === 'success'
                ? 'Congratulations! The gift has been successfully redeemed.'
                : `${result?.message || 'The system in overload. Please try again later.'}`}
            </p>
          </div>
          <button className="gift-verify-button" onClick={handleBackToMenu}>
            Back Home
          </button>
        </div>
      </div>
    </>
  );
};

export default GiftVerify;
