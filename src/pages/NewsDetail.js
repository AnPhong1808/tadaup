import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./NewsDetail.css";
import sharingIcon from "../components/assets/icons/sharing.png";
import backIcon from "../components/assets/icons/back.png";
import socialIcon from "../components/assets/icons/social.png";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

function NewsDetail() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const chartContainerRef = useRef(); // Ref cho biểu đồ
  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  // Lấy thông tin bài viết
  useEffect(() => {
    const fetchNewsDetail = async () => {
      const cachedUserData = sessionStorage.getItem("userData");
      if (cachedUserData) {
        setUserData(JSON.parse(cachedUserData));
      } else {
        console.error("No user data found in sessionStorage!");
        return;
      }

      try {
        const response = await fetch(`https://admin.tducoin.com/api/news/${id}`, {
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
        if (data && data.data) {
          setNews(data.data);
        } else {
          setError("Không tìm thấy bài viết");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return <ReloadSkeleton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!news) {
    return <div>Không tìm thấy bài viết</div>;
  }

  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${news.banner}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    window.location.href
  )}&text=${encodeURIComponent(news.title)}`;
  const telegramChannelUrl = "https://t.me/tadaup";

  return (
    <div className="news-detail-container">
      <div className="banner-header">
        <button className="backIcon" onClick={() => window.history.back()}>
          <img src={backIcon} alt="Back Icon" className="backIconImage" />
        </button>
        <PreloadImage src={picUrl} alt="Banner" />
      </div>
      <div className="news-detail-content">
        <h2>{news.title}</h2>
        <div className="name-time-container">
          <p className="name-time">
            {news.name} - {news.time}
          </p>
          <div className="share-icon-news">
            <a href={telegramShareUrl} target="_blank" rel="noopener noreferrer" className="share-link">
              <span>Chia sẻ</span>
              <img src={sharingIcon} alt="Share Icon" className="share-icon" />
            </a>
          </div>
        </div>
        <div className="content-news-wrapper">
  <div
    className="content-news"
    dangerouslySetInnerHTML={{ __html: news.description }}
  />
</div>
        <div className="telegram-channel-link">
          <a href={telegramChannelUrl} target="_blank" rel="noopener noreferrer" className="go-to-telegram-button">
            <img src={socialIcon} alt="Social Icon" className="social-icon" /> Kênh thảo luận
          </a>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
