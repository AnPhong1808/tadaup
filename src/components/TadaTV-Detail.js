import React, { useState } from "react";
import './TadaTV-Detail.css'; // Import CSS để thêm hiệu ứng modal

const TadaTVDetail = ({ title, description, clip, closeModal }) => {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Hiển thị tiêu đề và mô tả */}
        <h2>{title}</h2>
        <p>{description}</p>
        
        {/* Hiển thị video */}
        <iframe
          width="560"
          height="315"
          src={clip}
          title="Video"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>

        {/* Nút đóng modal */}
        <button className="close-modal" onClick={closeModal}>X</button>
      </div>
    </div>
  );
};

export default TadaTVDetail;
