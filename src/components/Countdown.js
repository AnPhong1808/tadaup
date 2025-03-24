import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Countdown = () => {
  const [countdown, setCountdown] = useState(3);  // Trạng thái cho đếm ngược
  const navigate = useNavigate();

  // Bắt đầu đếm ngược khi component được render
  useEffect(() => {
    if (countdown === 0) {
      // Chuyển hướng khi đếm ngược kết thúc
      navigate('/quizstarting');
      return;
    }
    
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000); // Giảm mỗi giây

    // Dọn dẹp khi component bị unmount
    return () => clearInterval(timer);
  }, [countdown, navigate]);

  return (
    <div 
      style={{
        backgroundColor: 'white',
        position: 'fixed',
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', /* Chiếm toàn bộ chiều cao màn hình */
        display: 'flex',
        justifyContent: 'center',  // Canh giữa theo chiều ngang
        alignItems: 'center',      // Canh giữa theo chiều dọc
        zIndex: 999,  // Đảm bảo Footer luôn ở trên các thành phần khác
      }}
    >
      <div 
        style={{
          fontSize: '80px', 
          fontWeight: 'bold',
          color: 'black',
        }}
      >
        {countdown}
      </div>
    </div>
  );
};

export default Countdown;
