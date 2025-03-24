import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./NewsDetail.css";
import sharingIcon from "../components/assets/icons/sharing.png";
import backIcon from "../components/assets/icons/back.png";
import CharityInfo from "../components/Charity-Info";
import GiftInfo from "../components/Gift-Info";
import CharityRank from "../components/Charity-Rank";
import GiftRules from "../components/Gift-Rules";
import CharityStart from "../components/Charity-Start";
import GiftStart from "../components/Gift-Start";
import activecoinIcon from "../components/assets/icons/coin-active.png";
import usdtIcon from "../components/assets/icons/usdt.png";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

function QuaThuongDetail() {
  const { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const dataTypeFromUrl = queryParams.get("dataType");

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dataUser, setDataUser] = useState(null); // Store dataUser from session
  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  useEffect(() => {
    const fetchDetail = async () => {
      const dataUser = sessionStorage.getItem("userData");
      if (dataUser) {
        setDataUser(JSON.parse(dataUser));
      } else {
        console.error("No user data found in sessionStorage!");
        return;
      }

      setLoading(true);
      let apiUrl = "";

      if (dataTypeFromUrl === "tuthien") {
        apiUrl = `https://admin.tducoin.com/api/charity/${id}`;
      } else if (dataTypeFromUrl === "doithuong") {
        apiUrl = `https://admin.tducoin.com/api/gift/${id}`;
      } else {
        setError("Invalid dataType");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu");
        }

        const data = await response.json();
        setQuiz(data.data || null);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, dataTypeFromUrl]);

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
        {dataTypeFromUrl === "tuthien" ? (
          <>
            <h2 className="quiz-detail-title">{quiz.title}</h2>
            <div className="name-time-container">
              <div className="players">
                <div className="avatar-container">
                  {quiz.top_contributors &&
                    quiz.top_contributors.slice(0, 4).map((member, index) => (
                      <div
                        key={index}
                        className="avatar"
                        style={{
                          backgroundImage: `url(${BASE_URL}${member.avatar})`,
                        }}
                      ></div>
                    ))}
                </div>
                + {quiz.total_contributors}
              </div>
              <div className="share-icon-news">
                <a
                  href={telegramShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-link"
                >
                  <span>Chia sẻ</span>
                  <img
                    src={sharingIcon}
                    alt="Share Icon"
                    className="share-icon"
                  />
                </a>
              </div>
            </div>

            <div className="status-charity">
              <div className="status-line">
                <div className="status-background"></div>
                <div
                  className="status-progress"
                  style={{
                    width: `${
                      (quiz.charity_status / quiz.charity_target) * 100
                    }%`,
                  }}
                ></div>
                <span
                  className="charity-status-text"
                  style={{
                    left: `${
                      (quiz.charity_status / quiz.charity_target) * 100
                    }%`,
                    top: "-25px",
                  }}
                >
                  {quiz.charity_status}
                </span>
              </div>
              <div className="quiz-footer">
                <span className="total">{quiz.charity_title}</span>
                <span className="charity-value-icon">
                  <img
                    src={usdtIcon}
                    alt="USDT Icon"
                    className="usdt-icon"
                  />
                  {quiz.charity_target} USDT
                </span>
              </div>
            </div>

            <CharityInfo quiz={quiz} />
            <div className="QuizRank">
              <span className="quiz-subtitle">
                Thành viên đóng góp tiêu biểu
              </span>
              <CharityRank charityID={quiz.id} />
            </div>
            <CharityStart quiz={quiz} />
          </>
        ) : dataTypeFromUrl === "doithuong" ? (
          <>
            <h2 className="quiz-detail-title">{quiz.title}</h2>
            <GiftInfo quiz={quiz} />
            <div className="QuizRules">
              <GiftRules rules={quiz.rules} />
            </div>
            <GiftStart
              giftID={quiz.id}
              giftValue={quiz.giftValue}
              userID={dataUser ? dataUser.userID : null}
              walletAC={dataUser ? dataUser.wallet_AC : null}
            />
          </>
        ) : (
          <div>Loại bài viết không xác định.</div>
        )}
      </div>
    </div>
  );
}

export default QuaThuongDetail;
