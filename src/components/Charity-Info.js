import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import charityIcon from '../components/assets/icons/charity.png'; // Đảm bảo đường dẫn đúng
import nextIcon from '../components/assets/icons/next.png'; // Đảm bảo đường dẫn đúng

function CharityInfo({ quiz }) {
  const navigate = useNavigate(); // Khởi tạo hàm navigate

  // Hàm xử lý khi nhấn nút
  const handleNavigate = () => {
    // Điều hướng tới trang chi tiết quiz (thay đổi đường dẫn tùy vào yêu cầu)
    navigate(`/news/${quiz.id}?dataType=${quiz.dataType}`);
  };

  return (
    <div className="card-container">
      <div className="card-title">Thông tin chương trình</div>
      <div className="card-divider"></div>
      <div className="card-content">{quiz.description}</div>
      {/* Đường phân chia */}''
      <div className="card-divider"></div>
      {/* Phần Button */}
      <div className="card-buttons">
        {/* Button với icon và tiêu đề */}
        <button className="card-button" onClick={handleNavigate}>
          <img src={charityIcon} alt="icon" className="ideas-icon" />
          <span>{quiz.charity_info}</span>
          <img src={nextIcon} alt="arrow" className="arrow-icon" />
        </button>
      </div>
    </div>
  );
}

export default CharityInfo;
