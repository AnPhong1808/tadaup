// src/components/ResultCard.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from './assets/avatar.gif'; // Đường dẫn đến ảnh avatar
import './ResultCard.css'; // Import CSS riêng
import targetIcon from '../components/assets/icons/target.png'; // Đảm bảo đường dẫn đúng

const ResultCard = ({ quiz_id, correctAnswers, totalQuestions, score }) => {
  const navigate = useNavigate();

  // Hàm định dạng thời gian từ ms sang "mm : ss : ms"
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(time % 1000).padStart(3, '0');
    return `${minutes} : ${seconds} : ${milliseconds}`;
  };

  // Hàm xử lý khi nhấn nút "Quay lại đấu trường"
  const handleBackToMenu = () => {
    // Lưu kết quả lên backend
    submitResult();
  };

  const submitResult = async () => {
    // Lấy userData từ sessionStorage
    const cachedUserData = sessionStorage.getItem('userData');
    const userData = cachedUserData ? JSON.parse(cachedUserData) : null;

    if (!userData || !userData.userID) {
      console.error('User data not found in sessionStorage. Cannot submit result.');
      return;
    }

    try {
      const response = await fetch('http://admin.tducoin.com/api/quiz/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE', // Sử dụng biến môi trường nếu có
        },
        body: JSON.stringify({
          userID: userData.userID,
          quizID: quiz_id,
          score: score, // Truyền score dưới dạng số (ms)
          correctAnswers: correctAnswers,
          totalQuestions: totalQuestions,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Failed to save quiz result:', result);
      } else {
        console.info('Quiz result saved successfully:', result);

        // Cập nhật sessionStorage với kết quả mới
        const updatedUserData = {
          ...userData,
          quiz_rank: [
            ...(userData.quiz_rank || []),
            { quizID: quiz_id, score: score, correctAnswers: correctAnswers },
          ],
        };

        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
        console.info('Session updated successfully:', updatedUserData);

        // Điều hướng về đấu trường
        navigate('/home');
      }
    } catch (error) {
      console.error('Error while submitting quiz result:', error);
    }
  };

  return (
    <>
      <div className="overlay"></div> {/* Lớp overlay nền trắng */}
      <div className="result-card-container">
        <div className="result-card">
          <img src={avatar} alt="Avatar" className="result-card-avatar" />
          <div className="result-card-details">
            <h3>Chúc mừng bạn đã hoàn thành phần thử thách!</h3>

            {/* Khung chữ nhật với icon và câu trả lời đúng nằm ở đây */}
            <div className="result-card-box">
              <img src={targetIcon} alt="Target Icon" className="result-card-icon" />
              <span className="result-card-answer">
                <b>{correctAnswers}/{totalQuestions}</b> câu trả lời đúng
              </span>
            </div>

            <p>Hoàn thành trong</p>
            <p className="bold-text">{formatTime(score)}</p>
          </div>

          <button className="result-card-button" onClick={handleBackToMenu}>
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </>
  );
};

export default ResultCard;
