import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./NewsDetail.css"; // Import CSS
import sharingIcon from "../components/assets/icons/sharing.png";
import backIcon from "../components/assets/icons/back.png";
import QuizInfo from "../components/Quiz-Info";
import QuizRank from "../components/Quiz-Rank";
import QuizRules from "../components/Quiz-Rules";
import QuizResult from "../components/Quiz-Result";
import QuizStart from "../components/Quiz-Start";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

function QuizDetail() {
  const { id } = useParams(); // Hứng `id` từ URL
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null); // Lưu dữ liệu người dùng từ sessionStorage
  const [userQuizResult, setUserQuizResult] = useState(null); // Lưu kết quả quiz nếu tồn tại

  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  // Lấy dữ liệu `userData` từ `sessionStorage` và lắng nghe thay đổi
  useEffect(() => {
    const updateUserData = () => {
      const cachedUserData = sessionStorage.getItem("userData");
      if (cachedUserData) {
        const parsedUserData = JSON.parse(cachedUserData);
        setUserData(parsedUserData);

        // Kiểm tra xem quizID hiện tại có trong quiz_rank hay không
        const currentQuizResult = parsedUserData.quiz_rank?.find(
          (rank) => parseInt(rank.quizID, 10) === parseInt(id, 10) // So sánh chặt chẽ quizID hiện tại
        );
        if (currentQuizResult) {
          setUserQuizResult(currentQuizResult); // Lưu kết quả nếu tìm thấy
        } else {
          setUserQuizResult(null); // Không tìm thấy kết quả
        }
      } else {
        console.error("No user data found in sessionStorage!");
      }
    };

    // Gọi ngay khi component mount
    updateUserData();

    // Lắng nghe sự thay đổi trong `sessionStorage`
    const handleStorageChange = (event) => {
      if (event.key === "userData") {
        updateUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [id]);

  // Fetch dữ liệu quiz từ API
  useEffect(() => {
    const fetchQuizDetail = async () => {
      try {
        const response = await fetch(`https://admin.tducoin.com/api/quiz/${id}`, {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu bài quiz.");
        }

        const data = await response.json();

        // Kiểm tra dữ liệu trả về có đúng định dạng hay không
        if (data && data.data) {
          setQuiz(data.data);
        } else {
          throw new Error("Dữ liệu bài quiz không hợp lệ.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetail();
  }, [id]);

  if (loading) {
    return <ReloadSkeleton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!quiz) {
    return <div>Không tìm thấy bài viết</div>;
  }

  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${quiz.banner}`;

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    window.location.href
  )}&text=${encodeURIComponent(quiz.title)}`;

  return (
    <div className="news-detail-container">
      <div className="banner-header">
        <button className="backIcon" onClick={() => window.history.back()}>
          <img src={backIcon} alt="Back Icon" className="backIconImage" />
        </button>
        <PreloadImage src={picUrl} alt="Banner" />
      </div>
      <div className="news-detail-content">
        <h2 className="quiz-detail-title">{quiz.title}</h2>
        <div className="name-time-container">
          <div className="players">
            <div className="avatar-container">
              {quiz.topCompleters &&
                quiz.topCompleters.slice(0, 4).map((member, index) => (
                  <div
                    key={index}
                    className="avatar"
                    style={{
                      backgroundImage: `url(${BASE_URL}${member.avatar})`,
                    }}
                  ></div>
                ))}
            </div>
            {quiz.members}
          </div>
          <div className="share-icon-news">
            <a href={telegramShareUrl} target="_blank" rel="noopener noreferrer" className="share-link">
              <span>Chia sẻ</span>
              <img src={sharingIcon} alt="Share Icon" className="share-icon" />
            </a>
          </div>
        </div>

        {/* Hiển thị QuizResult nếu userQuizResult có giá trị */}
        {userQuizResult && (
          <QuizResult 
            score={userQuizResult.score} 
            correctAnswers={userQuizResult.correctAnswers}
            totalQuestions={userQuizResult.totalQuestions} 
          />
        )}

        <QuizInfo 
          description={quiz.description} 
          knowledgeTitle={quiz.knowledgeTitle}
          knowledgeTitle_link={quiz.knowledgeTitle_link}
        />
        
        <div className="QuizRank">
          <span className="quiz-subtitle">Bảng xếp hạng</span>
          <QuizRank quizID={quiz.id} />
        </div>
        <div className="QuizRules">
          <QuizRules rules={quiz.rules} />
        </div>
        {!userQuizResult && (
          <QuizStart quiz={quiz} />
        )}
      </div>
    </div>
  );
}

export default QuizDetail;
