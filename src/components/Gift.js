import React from "react";
import "./Gift.css";
import DOMPurify from "dompurify";
import coinIcon from "./assets/icons/coin-header.png";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

const Gift = ({ title, banner, description, giftValue, gift_title, remaining_gifts, backgroundColor }) => {
  
  const BASE_URL = "https://admin.tducoin.com/public/storage/";
  const picUrl = `${BASE_URL}${banner}`;
  
  return (
    <div className="gift" style={{ backgroundColor: backgroundColor || "#186ECC" }}>
      <div className="giftpic-container">
       <div className="news-pic">
          <div className="news-pic">
            <PreloadImage src={picUrl} alt="Pic" />
          </div> 
        </div>
      </div>
      <div className="gift-content">
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
        <div className="gift-footer-container">
          <div className="gift-footer">
            <span className="total">{gift_title}</span>
            <span className="value-icon">
              <img src={coinIcon} alt="CoinActive Icon" className="giftcoin-icon" />
              {giftValue} điểm
            </span>
          </div>
          <div className="gift-amount">            
            <span>CÒN LẠI</span>
            <span><b>{remaining_gifts}</b></span>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Gift;
