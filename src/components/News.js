import React from "react";
import DOMPurify from "dompurify";
import "./News.css";
import heartIcon from './assets/icons/heart.png';
import commentIcon from './assets/icons/comment.png';
import coinactiveIcon from './assets/icons/coin-active.png';
import doneIcon from './assets/icons/done.png';
import sharingIcon from './assets/icons/sharing.png';
import { PreloadImage } from "../components/waiting";

const News = ({ title, banner, description, ac, heartValue, commentValue, author, created_at, status }) => {
  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${banner}`;

  return (
    <div className="news">
      <div className="news-content">
        <h2>{title}</h2>
        <p className="name-time">{author} - {created_at}</p>
        {/* Hiển thị text tối đa 100 ký tự từ description */}
        <p
          className="content-news"
          dangerouslySetInnerHTML={{
            __html: description
              ? DOMPurify.sanitize(description).replace(/(<([^>]+)>)/gi, '').substring(0, 150) + (description.length > 100 ? "..." : "")
              : "",
          }}>
        </p>
        <div className="news-pic-container">
          <div className="news-pic">
            <PreloadImage src={picUrl} alt="Pic" />
          </div> 
            
          {/* Hiển thị trạng thái dựa vào status */}
          {ac !== null && (
  status === 1 ? (
    <div className="coin-active">
      <img src={coinactiveIcon} alt="CoinActive Icon" className="coinactive-icon" />
      <span>{ac} point</span>
    </div>
  ) : (
    <div className="done">
      <img src={doneIcon} alt="Done Icon" className="done-icon" />
      <span>Completed</span>
    </div>
  )
)}

          <div className="news-footer-container">
            <div className="news-footer">
              <div className="left-icons">
                <span className="value-iconheart">
                  <img src={heartIcon} alt="Heart Icon" className="heart-icon" />
                  {heartValue}
                </span>
                <span className="value-iconcomment">
                  <img src={commentIcon} alt="Comment Icon" className="comment-icon" />
                  {commentValue}
                </span>
              </div>
              <div className="share-icon-container">
                <span className="value-iconshare">
                  Chia sẻ
                  <img src={sharingIcon} alt="Share Icon" className="share-icon" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
