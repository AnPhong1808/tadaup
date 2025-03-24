import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import QuizCard from "../components/QuizCard";
import Report from "../components/Report-Challenge";
import Footer from "../components/Footer";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";
import { preloadData } from "./api";
import "./DauTruong.css";

function DauTruong() {
  const [activeTab, setActiveTab] = useState("Đấu AC");
  const [quizData, setQuizData] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReport, setShowReport] = useState(true);

  const navigate = useNavigate();
  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  useEffect(() => {
    const fetchData = async () => {
      const cachedQuizData = sessionStorage.getItem("quizData");
      const cachedUserData = sessionStorage.getItem("userData");

      if (cachedQuizData && cachedUserData) {
        setQuizData(JSON.parse(cachedQuizData));
        setUserData(JSON.parse(cachedUserData));
        setLoading(false);
      } else {
        try {
          const preload = await preloadData(apiKey, 9999);
          setQuizData(preload.quizData);
          setUserData(preload.userData);

          sessionStorage.setItem("quizData", JSON.stringify(preload.quizData));
          sessionStorage.setItem("userData", JSON.stringify(preload.userData));
        } catch (err) {
          setError("Failed to load data");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [apiKey]);

  const quizStatusMap = useMemo(
    () => new Map(userData?.quiz_rank?.map((done) => [done.quizID, true]) || []),
    [userData]
  );

  const filteredQuizzes = quizData.filter((quiz) => quiz.dataType === activeTab);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewsClick = (id, dataType) => {
    navigate(`/quiz/${id}?dataType=${dataType}`);
  };

  if (loading) {
    return <ReloadSkeleton />;
  }

  if (error) {
    return <p style={{ color: "red" }}>Lỗi: {error}</p>;
  }

  const direction = activeTab === "Đấu AC" ? 1 : -1;

  return (
    <div className="App">
      <Header walletAC={userData.wallet_AC} userId={userData.userID} />
      <main>
        <div className="tab-menu">
          <button
            className={`btn_dauac ${activeTab === "Đấu AC" ? "active" : ""}`}
            onClick={() => handleTabClick("Đấu AC")}
          >
            AC
          </button>
          <button
            className={`btn_dauusdt ${activeTab === "Đấu USDT" ? "active" : ""}`}
            onClick={() => handleTabClick("Đấu USDT")}
          >
            USDT
          </button>
        </div>

        <div className="quiz-content">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => handleNewsClick(quiz.id, quiz.dataType)}
                >
                  <QuizCard
                    title={quiz.title}
                    description={quiz.description}
                    pic={quiz.banner}
                    prizeValue={quiz.prizeValue}
                    done_at={quiz.done_at}
                    topCompleters={quiz.topCompleters}
                    members={quiz.totalParticipants}
                    status={quizStatusMap.has(quiz.id) ? 0 : 1}
                    gift_title={quiz.gift_title}
                  />
                </div>
              ))}
        </div>
        {showReport && (
  <div className="report-modal">
    <Report
      onClose={() => setShowReport(false)}
    />
  </div>
)}
      </main>
      <Footer />
    </div>
  );
}

export default DauTruong;
