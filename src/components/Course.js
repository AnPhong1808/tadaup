import React from "react";
import "./Course.css";
import DOMPurify from "dompurify";
import coinactiveIcon from './assets/icons/coin-active.png';
import doneIcon from './assets/icons/done.png';
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

const Course = ({ title, banner, description, ac, completion, status }) => {
  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${banner}`;

  return (
    <div className="course">
      <div className="pic-container">
        <div className="news-pic">
            <PreloadImage src={picUrl} alt="Pic" />
            </div>
        {/* Chỉ xét if để hiển thị nội dung dựa vào status */}
        {completion === 100 ? (
            <div className="done">
            <img src={doneIcon} alt="Done Icon" className="done-icon" />
            <span>Đã hoàn thành</span>
            </div>
          ) : (
            <div className="coin-active">
            <img src={coinactiveIcon} alt="CoinActive Icon" className="coinactive-icon" />
            <span>{ac} điểm</span>
            </div>
           
          )}

      </div>
      <div className="course-content">
        <h2>{title}</h2>
        {/* Hiển thị text tối đa 100 ký tự từ description */}
        <p
          className="content-news"
          dangerouslySetInnerHTML={{
            __html: description
              ? DOMPurify.sanitize(description).replace(/(<([^>]+)>)/gi, '').substring(0, 150) + (description.length > 100 ? "..." : "")
              : "",
          }}>
        </p>
        {/* Status Line */}
        <div className="status-line">
        <div className="status-background"></div>
        <div className="status-progress" style={{ width: `${completion}%` }}></div>
          {completion > 90 ? (
          <span className="status-text-complete" style={{ right: '0%', top: '-25px' }}>
          {completion}%
          </span>
      ) : completion < 10 ? (
        <span className="status-text" style={{ left: '3%', top: '-25px' }}>
        {completion}%
        </span>
      ) : (
        <span className="status-text" style={{ left: `${completion}%`, top: '-25px' }}>
        {completion}%
    </span>
      )}
  </div>

</div>
    </div>
  );
};

export default Course;
