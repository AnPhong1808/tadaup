import React from 'react';
import './Quiz-Result.css'; // Đảm bảo đã thêm CSS cho phần tử
import { useNavigate } from 'react-router-dom'; // Import useNavigate từ react-router-dom
import targetIcon from '../components/assets/icons/target.png'; // Đảm bảo đường dẫn đúng

function QuizResult({ score, correctAnswers, totalQuestions  }) {
  const navigate = useNavigate(); // Khởi tạo hàm navigate
  // Hàm định dạng thời gian từ ms sang "mm : ss : ms"
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(time % 1000).padStart(3, '0');
    return `${minutes} : ${seconds} : ${milliseconds}`;
  };

  return (
    <div className="quiz-result-container">
      <div className="quiz-result-item">
        <div className="quiz-result-icon-text">
          <div className="result-icon-container">
            <img src={targetIcon} alt="icon" className="result-icon" />
          </div>
          <div className="quiz-result-correct-answers">
            <span>{correctAnswers}/{totalQuestions}</span> Câu trả lời đúng
          </div>
        </div>
      </div>

      <div className="quiz-result-time-label">
        Thời gian hoàn thành
      </div>

      <div className="quiz-result-time-completion">
        {formatTime(score)}
      </div>
    </div>
  );
}

export default QuizResult;