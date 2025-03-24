import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GiftVerify from './Gift-Verify'; // Import component GiftVerify

const GiftStart = ({ userID, giftID, giftValue, walletAC }) => {
  const [result, setResult] = useState(null); // State to store API result
  const navigate = useNavigate();

  const handleStartQuiz = async () => {
    if (!userID || !giftID || !giftValue) {
      console.error('Required data is missing:', { userID, giftID, giftValue });
      alert('Thông tin không đầy đủ. Vui lòng kiểm tra lại.');
      return;
    }

    // So sánh wallet_AC với giftValue
    if (walletAC < giftValue) {
      setResult({
        status: 'error',
        message: 'Anh chị không đủ số AC để đổi quà.',
      });
      return;
    }

    try {
      const postData = {
        userID: Number(userID),
        giftID: Number(giftID),
        giftValue: Number(giftValue),
      };

      console.log('Sending POST request with data:', postData);

      const response = await fetch('http://admin.tducoin.com/api/gift/redeem-gift', {
        method: 'POST',
        headers: {
          'x-api-key': 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      console.log('Response Status:', response.status);

      const responseText = await response.text(); // Lấy phản hồi thô
      console.log('Raw Response:', responseText);

      let result;
      try {
        result = JSON.parse(responseText); // Thử parse JSON
      } catch (error) {
        console.warn('Response is not JSON, using raw text instead.');
        result = { status: 'success', message: responseText }; // Sử dụng phản hồi thô
      }

      console.log('Parsed Result:', result);
      setResult(result);

    } catch (error) {
      console.error('Error redeeming gift:', error);
      setResult({
        status: 'error',
        message: error.message || 'Không thể kết nối với API.',
      });
    }
  };

  // If the result is set, render GiftVerify component
  if (result) {
    return <GiftVerify result={result} />;
  }

  return (
    <div
      className="footer-quiz-container"
      style={{
        backgroundColor: 'white',
        position: 'fixed',
        bottom: 2,
        left: 0,
        width: '100%',
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
      }}
    >
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
          width: 'auto',
          textAlign: 'center',
        }}
      >
        Đón lộc ngay
      </button>
    </div>
  );
};

export default GiftStart;
