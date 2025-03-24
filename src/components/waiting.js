import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// Skeleton Loading for News Detail
export const ReloadSkeleton = () => {
  return (
    <div className="news-detail-container">
      <div className="banner-header">
        <Skeleton height={200} />
      </div>
      <div className="news-detail-content">
        <h2>
          <Skeleton width="60%" />
        </h2>
        <p className="name-time">
          <Skeleton width="40%" />
        </p>
        <div>
          <Skeleton height={150} />
        </div>
      </div>
    </div>
  );
};

export const PreloadImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="preload-image-container" style={{ position: "relative" }}>
      {/* Ảnh chính */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`${className} ${loaded ? "loaded" : "loading"}`}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s ease-in-out",
          width: "100%",
          height: "auto",
          display: "block",
        }}
      />
      {/* Nền trắng khi ảnh chưa tải xong */}
      {!loaded && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
        ></div>
      )}
    </div>
  );
};

