import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import ideasIcon from '../components/assets/icons/ideas.png'; // Đảm bảo đường dẫn đúng
import nextIcon from '../components/assets/icons/next.png'; // Đảm bảo đường dẫn đúng

function QuizInfo({ description, knowledgeTitle, knowledgeTitle_link }) {
  const navigate = useNavigate(); // Khởi tạo hàm navigate

  // Hàm xử lý khi nhấn nút
  const handleNavigate = () => {
    // Điều hướng tới trang chi tiết quiz (thay đổi đường dẫn tùy vào yêu cầu)
    navigate(`/news/${knowledgeTitle_link}`);
  };

  return (
    <div className="card-container">
      <div className="card-title">Nội dung</div>
      <div className="card-divider"></div>
      <div className="card-content">{description}</div>
      {/* Đường phân chia */}
      <div className="card-divider"></div>
      {/* Phần Button */}
      <div className="card-buttons">
        {/* Button với icon và tiêu đề */}
        <button className="card-button" onClick={handleNavigate}>
          <img src={ideasIcon} alt="icon" className="ideas-icon" />
          <span>{knowledgeTitle}</span>
          <img src={nextIcon} alt="arrow" className="arrow-icon" />
        </button>
      </div>
    </div>
  );
}

export default QuizInfo;
