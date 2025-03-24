import React, { useEffect, useState } from 'react';
import './Quiz-Rank.css'; // Đảm bảo đã thêm CSS cho phần tử

function QuizRank({ quizID }) {
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE';

  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(time % 1000).padStart(3, '0');
    return `${minutes} : ${seconds} : ${milliseconds}`;
  };

  useEffect(() => {
    // Gọi API để lấy dữ liệu người chơi
    const fetchTopPlayers = async () => {
      try {
        if (!quizID) {
          throw new Error("QuizID is not provided.");
        }

        const response = await fetch(`http://admin.tducoin.com/api/quiz/getUsersByQuizID/${quizID}`, {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.data) {
          setTopPlayers(data.data); // Cập nhật dữ liệu
        } else {
          throw new Error("Invalid API response structure.");
        }
      } catch (err) {
        setError(err.message); // Lưu lỗi vào state
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
  }, [quizID]); // Sử dụng quizID trong dependency array

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const BASE_URL = "http://admin.tducoin.com/public/storage/";

  return (
    <div className="card-container">
      {topPlayers.map((player, index) => (
        <div key={player.id}>
          <div className="card-row">
            <div className="left-section">
              <div className="rank">#{index + 1}</div>
              <div className="quizrank-circle">
              <img src={`${BASE_URL}${player.user.avatar}` || '/default-avatar.png'} alt={`Avatar ${index + 1}`} className="avatar-image" />
              </div>
              <div className="rank-name">{player.user.name}</div>
            </div>
            <div className="rank-time">{formatTime(player.score)}</div>
          </div>
          {index < topPlayers.length - 1 && <div className="card-divider"></div>}
        </div>
      ))}
    </div>
  );
}

export default QuizRank;
