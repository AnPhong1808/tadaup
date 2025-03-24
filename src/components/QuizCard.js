import React from "react";
import "./QuizCard.css";
import DOMPurify from "dompurify";
import usdtIcon from './assets/icons/usdt.png';
import timerIcon from './assets/icons/timer.png';
import doneIcon from './assets/icons/done.png';
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

const QuizCard = ({ 
  id, 
  dataType,
  title, 
  pic, 
  description, 
  prizeValue, 
  done_at, 
  topCompleters, // Truyền danh sách topCompleters
  members, 
  gift_title, 
  status, 
  created_at 
}) => {
  // Tính toán số ngày còn lại hoặc đã qua
  const currentDate = new Date();
  const createdDate = new Date(created_at);
  const daysElapsed = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
  const daysLeft = done_at - daysElapsed;

  // Thêm tiền tố vào link ảnh
  const API_URL = "https://api.telegram.org/file/bot7458768044:AAG-LvoaLQhn8VMgCY1ZCtnq099gMvfEnW4/";
  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${pic}`;

  return (
    <div className="quiz-card">
      <div className="pic-container">
        <div className="news-pic">
          <PreloadImage src={picUrl} alt="Pic" />
        </div> 

        {/* Hiển thị nội dung dựa vào status */}
        {status === 1 ? (
          <div className="time-left">
            <img src={timerIcon} alt="Timer Icon" className="timer-icon" />
            <span>Kết thúc trong {daysLeft > 0 ? `${daysLeft} ngày` : "hôm nay"}</span>
          </div>
        ) : (
          <div className="done">
            <img src={doneIcon} alt="Done Icon" className="done-icon" />
            <span>Đã hoàn thành</span>
          </div>
        )}
      </div>
      <div className="quiz-content">
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
        <div className="quiz-footer-container">
          <div className="quiz-footer">
            <span className="total">{gift_title}</span>
            <span className="value-icon">
              <img src={usdtIcon} alt="USDT Icon" className="usdt-icon" />
              {prizeValue} USDT
            </span>
          </div>
          <div className="players">
            <div className="avatar-container">
              {/* Hiển thị avatar từ topCompleters */}
              {topCompleters &&
                topCompleters.slice(0, 4).map((member, index) => (
                  <div
                    key={index}
                    className="avatar"
                    style={{
                      backgroundImage: `url(${API_URL}${member.avatar})`
                    }}
                  ></div>
                ))}
            </div>
            + {members}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
