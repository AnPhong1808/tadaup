import React from "react";
import "./TadaTV.css";
import DOMPurify from "dompurify";
import heartIcon from './assets/icons/heart.png';
import commentIcon from './assets/icons/comment.png';
import coinactiveIcon from './assets/icons/coin-active.png';
import doneIcon from './assets/icons/done.png';
import sharingIcon from './assets/icons/sharing.png';
import clipIcon from './assets/icons/clip.png';
import { ReloadSkeleton, PreloadImage } from "../components/waiting";


const TadaTV = ({ title, pic, description, ac, heartValue, commentValue, name, time, status, clip }) => {
  // Giả sử đường dẫn gốc tới thư mục ảnh là 'https://example.com/storage/'
  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${pic}`;

  return (
    <div className="tadatv">     
      <div className="tadatv-content">
        <h2>{title}</h2>
        <p className="name-time">{name} - {time}</p>
        {/* Hiển thị text tối đa 100 ký tự từ description */}
        <p
          className="content-news"
          dangerouslySetInnerHTML={{
            __html: description
              ? DOMPurify.sanitize(description).replace(/(<([^>]+)>)/gi, '').substring(0, 150) + (description.length > 100 ? "..." : "")
              : "",
          }}>
        </p>
        <div className="tadatv-pic-container">
          {/* Đảm bảo đường dẫn ảnh hợp lý */}
          <div className="news-pic">
            <div className="news-pic">
              <PreloadImage src={picUrl} alt="Pic" />
            </div> 
          </div>
          {/* Chỉ xét if để hiển thị nội dung dựa vào status */}
          {status === 1 ? (
            <div className="coin-active">
              <img src={coinactiveIcon} alt="CoinActive Icon" className="coinactive-icon" />
              <span>{ac} point</span>
            </div>
          ) : (
            <div className="done">
              <img src={doneIcon} alt="Done Icon" className="done-icon" />
              <span>Complited</span>
            </div>
          )}
          <div className="clip">
            <PreloadImage src={clipIcon} alt="Clip Icon" className="clip-icon" />
          </div>
          <div className="tadatv-footer-container">
            <div className="tadatv-footer">
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


export default TadaTV;
