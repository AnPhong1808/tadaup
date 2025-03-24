import React from 'react';
import logo from './assets/logoTadaUp.jpg';

const Loading = () => {
  return (
    <div
      style={{
        position: 'fixed', // Đảm bảo Loading phủ toàn màn hình
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 1)', // Nền trắng
        zIndex: 9999, // Cao hơn tất cả các thành phần khác
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={logo}
        alt="Loading Logo"
        style={{
          width: '250px',
          height: '250px',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default Loading;
