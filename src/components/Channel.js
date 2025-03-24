import React, { useState, useEffect, useRef } from "react";
import "./Course.css";
import DOMPurify from "dompurify";
import lockIcon from './assets/icons/lock.png';
import doneIcon from './assets/icons/done.png';
import ACIcon from './assets/icons/coin-header.png';
import chartIcon from './assets/icons/chart.png';
import moneygrowthIcon from './assets/icons/money-growth.png';
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

const Channel = ({ author, channel_id, avatar, description, profitRank, totalR, totalSignals, price, status, onReportClick, updateFollowingAuthors }) => {
  const BASE_URL = "http://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${avatar}`;

  const [tooltipVisible, setTooltipVisible] = useState({ chart: false, moneyGrowth: false, acIcon: false });
  const [isFollowing, setIsFollowing] = useState(status === 1);  // Trạng thái theo dõi được cập nhật ngay từ đầu

  const tooltipRef = useRef(null);

  const toggleTooltip = (type) => {
    setTooltipVisible((prev) => ({
      chart: type === "chart" ? !prev.chart : false,
      moneyGrowth: type === "moneyGrowth" ? !prev.moneyGrowth : false,
      acIcon: type === "acIcon" ? !prev.acIcon : false,
    }));
  };

  const handleOutsideClick = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setTooltipVisible({ chart: false, moneyGrowth: false, acIcon: false });
    }
  };

  // Kiểm tra xem kênh có trong danh sách booking_channels hay không từ sessionStorage
  const checkIfFollowing = () => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
    const bookingChannels = storedUserData?.booking_channels || [];  // Lấy danh sách booking_channels từ data
    return bookingChannels.some(channel => channel.author === author && channel.channel_id === channel_id);  // Kiểm tra nếu author và channel_id khớp
  };

  useEffect(() => {
    // Thiết lập interval để kiểm tra mỗi giây
    const interval = setInterval(() => {
      setIsFollowing(checkIfFollowing());  // Cập nhật trạng thái theo dõi
    }, 1000);  // Cập nhật mỗi giây
  
    document.addEventListener("click", handleOutsideClick);  // Thiết lập sự kiện click
  
    return () => {
      clearInterval(interval);  // Dọn dẹp interval khi component unmount
      document.removeEventListener("click", handleOutsideClick);  // Dọn dẹp sự kiện click
    };
  }, [author, channel_id]);  // Chạy lại khi author hoặc channel_id thay đổi

  // Nếu user đã theo dõi channel (status = 1), gọi updateFollowingAuthors để cập nhật lại danh sách theo dõi trong Earn
  useEffect(() => {
    if (isFollowing || status === 1) {
      updateFollowingAuthors(author); // Cập nhật lại danh sách theo dõi trong Earn
    }
  }, [isFollowing, author, updateFollowingAuthors]);

  const roundedProfitRank = Math.round(profitRank);

  return (
    <div className="course">
      <div className="pic-container">
        <div className="news-pic">
          <PreloadImage src={avatar} alt="Pic" />
        </div>  
        {(isFollowing || status === 1) ? (
          <div className="done">
            <img src={doneIcon} alt="Done Icon" className="done-icon" />
            <span>Following Channel</span>
          </div>
        ) : (
          <div className="coin-active" onClick={onReportClick}>
            <img src={lockIcon} alt="CoinActive Icon" className="coinactive-icon" style={{ width: "15px", height: "auto", marginRight: "3px" }} />
            <span>Lock Channel</span>
          </div>
        )}
      </div>
      <div className="course-content" ref={tooltipRef}>
        <h2>{author}</h2>
        <p
          className="content-news"
          dangerouslySetInnerHTML={{
            __html: description
              ? DOMPurify.sanitize(description).replace(/(<([^>]+)>)/gi, '').substring(0, 150) + (description.length > 100 ? "..." : "")
              : "No description available.",
          }}
        ></p>
        <div className="status-line">
          <div className="status-background"></div>
          <div className="status-progress" style={{ width: `${roundedProfitRank}%` }}></div>
          {profitRank > 80 ? (
            <span className="status-text-complete" style={{ right: '0%', top: '-25px' }}>
              WPR: {roundedProfitRank}%
            </span>
          ) : profitRank < 20 ? (
            <span className="status-text" style={{ left: '7%', top: '-25px' }}>
              WPR: {roundedProfitRank}%
            </span>
          ) : (
            <span className="status-text" style={{ left: `${profitRank}%`, top: '-25px' }}>
              WPR: {roundedProfitRank}%
            </span>
          )}
        </div>
        <div className="channel-footer">
          <div className="channel-icon-container left" onClick={() => toggleTooltip("acIcon")}>
            <img src={ACIcon} alt="AC Icon" className="channel-icon" style={{ width: "25px", height: "auto" }} />
            <span><b>{price || 0}</b></span>
            {tooltipVisible.acIcon && (
              <div className="channel-tooltip">
                Price per month
              </div>
            )}
          </div>

          <div className="channel-footer-icons">
            <div className="channel-icon-container" onClick={() => toggleTooltip("chart")}>
              <img src={chartIcon} alt="Chart Icon" className="channel-icon" />
              <span>{totalSignals || 0}</span>
              {tooltipVisible.chart && (
                <div className="channel-tooltip">
                  Total Signals
                </div>
              )}
            </div>
            <div className="channel-icon-container" onClick={() => toggleTooltip("moneyGrowth")}>
              <img src={moneygrowthIcon} alt="Money Growth Icon" className="channel-icon" />
              <span>{totalR || 0}</span>
              {tooltipVisible.moneyGrowth && (
                <div className="channel-tooltip">
                  Total R
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Channel;