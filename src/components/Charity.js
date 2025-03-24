import React from "react";
import "./Charity.css";
import DOMPurify from "dompurify";
import usdtIcon from './assets/icons/usdt.png';
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

const Charity = ({ id, title, banner, description, charity_target, charity_status, top_contributors, members, charity_title }) => {
  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${banner}`;
  
  return (
    <div className="charity">
      <div className="charitypic-container">
        <div className="news-pic">
            <PreloadImage src={picUrl} alt="Pic" />
            </div>
      </div>
      <div className="charity-content">
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
          <div className="status-progress" style={{ width: `${(charity_status/charity_target)*100}%` }}></div>
          <span
            className="charity-status-text"
            style={{ left: `${(charity_status / charity_target) * 100}%`, top: '-25px' }}>
            {charity_status}
          </span>
        </div>
        <div className="quiz-footer-container">
          <div className="quiz-footer">
            <span className="total">{charity_title}</span>
            <span className="value-icon">
              <img src={usdtIcon} alt="USDT Icon" className="usdt-icon" />
              {charity_target} USDT
            </span>
          </div>
          <div className="players">
            <div className="avatar-container">
            {top_contributors &&
                top_contributors.slice(0, 4).map((member, index) => (
                  <div
                    key={index}
                    className="avatar"
                    style={{
                      backgroundImage: `url(${BASE_URL}${member.avatar})`
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

export default Charity;
