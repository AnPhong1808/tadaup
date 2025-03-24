import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizStart = ({ quiz }) => {
  const navigate = useNavigate();

const handleStartQuiz = () => {
  if (!quiz || !quiz.id || !quiz.dataType) {
    console.error('Quiz data is incomplete:', quiz);
    return;
  }

  const path = `/quizstarting/${quiz.id}?collection_id=${quiz.collection_id}`;
  console.log('Navigating to:', path); // Debug URL
  navigate(path);
};


  return (
    <div className="footer-quiz-container" style={{
      backgroundColor: 'white', 
      position: 'fixed', 
      bottom: 2,
      left: 0, 
      width: '100%', 
      padding: '10px', 
      display: 'flex', 
      justifyContent: 'center',  // Canh giữa theo chiều ngang
      alignItems: 'center',      // Canh giữa theo chiều dọc
      zIndex: 999,  // Đảm bảo Footer luôn ở trên các thành phần khác
    }}>
      <button 
        onClick={handleStartQuiz} 
        style={{
          backgroundColor: 'black',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 'bold',
          width: 'auto',  // Chỉnh lại chiều rộng tự động
          textAlign: 'center',
        }}
      >
        Bắt đầu ngay
      </button>
    </div>
  );
}

export default QuizStart;
