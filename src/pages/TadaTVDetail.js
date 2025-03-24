import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./NewsDetail.css"; // Import CSS
import "./TadaTV.css";
import clipIcon from "../components/assets/icons/clip.png";
import sharingIcon from "../components/assets/icons/sharing.png";
import backIcon from "../components/assets/icons/back.png";
import socialIcon from "../components/assets/icons/social.png";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

function TadaTVDetail() {
  const { id } = useParams(); // Lấy ID từ URL

  const [tadatv, setTadatv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tadatvShowVideo, setTadatvShowVideo] = useState(false); // State để mở video

  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  useEffect(() => {
    const fetchTadaTVDetail = async () => {
      const cachedUserData = sessionStorage.getItem("userData");
      if (cachedUserData) {
        const parsedUserData = JSON.parse(cachedUserData);
        setUserData(parsedUserData);
      } else {
        console.warn("⚠️ No user data found in sessionStorage!");
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
          throw new Error("❌ Không thể lấy dữ liệu");
        }

        const data = await response.json();
        if (data && data.data) {
          setTadatv(data.data);
        } else {
          setError("⚠️ Không tìm thấy bài viết");
        }
      } catch (error) {
        console.error("❌ Fetch Error:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTadaTVDetail();
  }, [id]);

  useEffect(() => {
    if (userData && userData.news_reads) {
      
      const markAsWatched = async () => {
        if (!id) {
          console.error("❌ Thiếu ID bản tin");
          return;
        }

        const hasWatched = userData.news_reads.some(
          (read) => read.news_id === parseInt(id, 10)
        );

        if (hasWatched) {
          return;
        }

        try {
          const response = await fetch("https://admin.tducoin.com/api/addbonus/news-read", {
            method: "POST",
            headers: {
              "x-api-key": apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userData.userID, // ID người dùng từ sessionStorage
              news_id: id, // ID bản tin
            }),
          });

          if (!response.ok) {
            throw new Error("❌ Không thể ghi nhận TadaTV đã xem");
          }

          if (result.success) {
            const updatedUserData = {
              ...userData,
              news_reads: [...userData.news_reads, { news_id: parseInt(id, 10) }],
              wallet_AC: result.wallet_AC,
            };
            setUserData(updatedUserData);
            sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
          } else {
            console.error("⚠️ Lỗi cộng điểm:", result.message);
          }
        } catch (error) {
          console.error("❌ API Error (markAsWatched):", error.message);
        }
      };

      markAsWatched();
    }
  }, [id, userData]);

  if (loading) {
    return <ReloadSkeleton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!tadatv) {
    return <div>Không tìm thấy bài viết</div>;
  }

  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${tadatv.banner}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    window.location.href
  )}&text=${encodeURIComponent(tadatv.title)}`;
  const telegramChannelUrl = "https://t.me/tadaup";

  return (
    <div className="news-detail-container">
      <div className="banner-header">
        <button className="backIcon" onClick={() => window.history.back()}>
          <img src={backIcon} alt="Back Icon" className="backIconImage" />
        </button>
        <button className="clipIcon" onClick={() => {
          setTadatvShowVideo(true);
        }}>
          <img src={clipIcon} alt="Clip Icon" className="clipIconImage" />
        </button>
        <PreloadImage src={picUrl} alt="Banner" />
      </div>
      <div className="news-detail-content">
        <h2>{tadatv.title}</h2>
        <div className="name-time-container">
          <p className="name-time">
            {tadatv.name} - {tadatv.time}
          </p>
          <div className="share-icon-news">
            <a href={telegramShareUrl} target="_blank" rel="noopener noreferrer" className="share-link">
              <span>Chia sẻ</span>
              <img src={sharingIcon} alt="Share Icon" className="share-icon" />
            </a>
          </div>
        </div>
        <p className="content-news">{tadatv.description}</p>
        <div className="telegram-channel-link">
          <a href={telegramChannelUrl} target="_blank" rel="noopener noreferrer" className="go-to-telegram-button">
            <img src={socialIcon} alt="Social Icon" className="social-icon" /> Kênh thảo luận
          </a>
        </div>
      </div>

      {/* Hiển thị video khi bấm vào clipIcon */}
      {tadatvShowVideo && (
  <div className="tadatv-video-overlay">
    <div className="tadatv-video-container">
      <button className="tadatv-close-video" onClick={() => {
        setTadatvShowVideo(false);
      }}>✕</button>

      {tadatv.clip.includes("youtube.com") ? (
        <iframe
          className="tadatv-video-player"
          src={`https://www.youtube.com/embed/${new URL(tadatv.clip).searchParams.get("v")}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <video src={tadatv.clip} controls autoPlay className="tadatv-video-player" />
      )}
    </div>
  </div>
)}

    </div>
  );
}

export default TadaTVDetail;
