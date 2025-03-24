import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import homeIcon1 from './assets/icons/trang-chu-1.png';
import homeIcon2 from './assets/icons/trang-chu-2.png';
import bookIcon1 from './assets/icons/kho-tang-1.png';
import bookIcon2 from './assets/icons/kho-tang-2.png';
import earnIcon1 from './assets/icons/earn-1.png';
import earnIcon2 from './assets/icons/earn-2.png';
import trophyIcon1 from './assets/icons/dau-truong-1.png';
import trophyIcon2 from './assets/icons/dau-truong-2.png';
import giftIcon1 from './assets/icons/qua-thuong-1.png';
import giftIcon2 from './assets/icons/qua-thuong-2.png';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true); // Trạng thái hiển thị của footer
  const [lastScrollY, setLastScrollY] = useState(0); // Lưu vị trí cuộn trước đó

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Cuộn xuống và không ở trên cùng -> Ẩn footer
        setIsVisible(false);
      } else {
        // Cuộn lên -> Hiện footer
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <footer className={`footer ${isVisible ? 'visible' : 'hidden'}`}>
      <Link to="/khotang" className="footer-button">
        <img
          src={location.pathname === '/khotang' ? bookIcon1 : bookIcon2}
          alt="Kho tàng"
          className="icon"
        />
        <span>Treasure</span>
      </Link>
      <Link to="/fundbot" className="footer-button">
        <img
          src={location.pathname === '/fundbot' ? homeIcon1 : homeIcon2}
          alt="FundBot"
          className="icon"
        />
        <span>Fund Bot</span>
      </Link>
      <Link to="/earn" className="footer-button">
        <img
          src={location.pathname === '/earn' ? earnIcon1 : earnIcon2}
          alt="Earn"
          className="icon"
        />
        <span>Signals</span>
      </Link>
      <Link to="/dautruong" className="footer-button">
        <img
          src={location.pathname === '/dautruong' ? trophyIcon1 : trophyIcon2}
          alt="Đấu trường"
          className="icon"
        />
        <span>Challenge</span>
      </Link>    
      <Link to="/quathuong" className="footer-button">
        <img
          src={location.pathname === '/quathuong' ? giftIcon1 : giftIcon2}
          alt="Quà thưởng"
          className="icon"
        />
        <span>Award</span>
      </Link>
    </footer>
  );
};

export default Footer;
