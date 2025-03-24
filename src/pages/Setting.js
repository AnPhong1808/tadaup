import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Setting.css";
import backIcon from "../components/assets/icons/back.png";
import naptienIcon from "../components/assets/icons/naptien.png";
import ruttienIcon from "../components/assets/icons/ruttien.png";
import acIcon from "../components/assets/icons/coin-header.png";
import bg from "../components/assets/bg-setting.jpg";
import SettingMenu from "../components/Setting-Menu";
import About from "../components/About";
import Terms from "../components/Terms";
import Affiliate from "../components/Affiliate-Profit";
import Language from "../components/Language";
import Profile from "../components/Profile";
import BuyAC from "../components/BuyAC";
import Swap from "../components/Report-Swap";

function Setting() {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isMenuSelected, setIsMenuSelected] = useState(false);
  const [showBuyAC, setShowBuyAC] = useState(false);
  const [showReportSwap, setShowSwap] = useState(false);
  const [startX, setStartX] = useState(0);

  // Lấy dữ liệu người dùng từ sessionStorage
  useEffect(() => {
    const updateUserData = () => {
      const cachedUserData = sessionStorage.getItem("userData");
      if (cachedUserData) {
        const parsedUserData = JSON.parse(cachedUserData);
        console.log("Parsed userData from sessionStorage:", parsedUserData); // Debug dữ liệu
        setUserData(parsedUserData);
        setLoading(false);
      } else {
        console.error("No user data found in sessionStorage!");
        setLoading(false); // Vẫn cho phép render để hiển thị lỗi nếu không có dữ liệu
      }
    };

    updateUserData();

    // Lắng nghe sự kiện storage (chỉ cần nếu dùng nhiều tab)
    const handleStorageChange = (event) => {
      if (event.key === "userData") {
        updateUserData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const [showFullAC, setShowFullAC] = useState(false);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  // Kiểm tra dữ liệu người dùng có khớp với id từ URL không
  const user = userData && userData.userID === id ? userData : null;
  if (!user) {
    return <div>Không tìm thấy bài viết</div>;
  }

  const BASE_URL = "https://admin.tducoin.com/public/";
  const picUrl = userData?.avatar
    ? `${BASE_URL}${userData.avatar}`
    : `${BASE_URL}images/avatars/9999.jpg`;

  const handleMenuSelect = (menu) => {
    setSelectedMenu(menu);
    setIsMenuSelected(true);
  };

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    if (touchEndX - startX > 100) {
      handleBack();
    }
  };

  const handleUpdateTotalCommission = (newTotalCommission) => {
    const updatedUserData = { ...userData, totalCommission: newTotalCommission };
    sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
    setUserData(updatedUserData); // Cập nhật state để trigger re-render
    console.log("Updated userData in Setting:", updatedUserData); // Debug
  };

  const handleBack = () => {
    if (selectedMenu !== null) {
      setSelectedMenu(null);
      setIsMenuSelected(false);
    } else {
      window.history.back();
    }
  };

  return (
    <div
      className="setting-detail-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="bannersetting-header">
        <button className="backIcon" onClick={handleBack}>
          <img src={backIcon} alt="Back Icon" className="backIconImage" />
        </button>
        <img src={bg} alt="Banner" className="bannersetting-image" />
        <div className="avatarsetting">
          <img src={picUrl} alt="Avatar" />
        </div>
      </div>
      <div className="setting-detail-content">
        <div className="setting-detail-row">
          {/* AC */}
          <div
            className="setting-detail-item"
            onClick={() => setShowFullAC((prev) => !prev)}
          >
            <img src={acIcon} alt="Icon" className="setting-detail-item-icon" />
            <div className="setting-detail-item-text">
              <span className="setting-detail-item-text-small">AC</span>
              <span className="setting-detail-item-text-large">
                {showFullAC ? userData.wallet_AC : formatNumber(userData.wallet_AC)}
              </span>
            </div>
          </div>

          {/* NẠP RÚT */}
          <div
            className="setting-detail-item setting-detail-item-deposit"
            onClick={() => setShowBuyAC(true)}
          >
            <img src={naptienIcon} alt="Icon" className="setting-coin-icon" />
            <div className="setting-detail-item-text setting-detail-item-text-naprut">
              <span className="setting-coin-button">Buy AC</span>
            </div>
          </div>
          <div
            className="setting-detail-item setting-detail-item-withdraw"
            onClick={() => setShowSwap(true)}
          >
            <img src={ruttienIcon} alt="Icon" className="setting-coin-icon" />
            <div className="setting-detail-item-text setting-detail-item-text-naprut">
              <span className="setting-coin-button">Swap</span>
            </div>
          </div>
        </div>

        {showBuyAC && (
          <div className="report-modal">
            <BuyAC
              userID={userData.userID}
              walletAC={userData.wallet_AC}
              onClose={() => setShowBuyAC(false)}
            />
          </div>
        )}
        {showReportSwap && (
          <div className="report-modal">
            <Swap
              userID={userData.userID}
              totalCommission={userData.totalCommission || 0} // Truyền trực tiếp từ userData
              addressWallet={userData.addressWallet}
              onClose={() => setShowSwap(false)}
              onUpdateTotalCommission={handleUpdateTotalCommission}
            />
          </div>
        )}
        
        {/* Nội dung chính */}
        {!isMenuSelected ? (
          <SettingMenu onMenuSelect={handleMenuSelect} />
        ) : (
          <div>
            {selectedMenu === "profile" && <Profile user={user} onBack={handleBack} />}
            {selectedMenu === "affiliate" && <Affiliate user={userData.userID} onBack={handleBack} />}
            {selectedMenu === "language" && <Language onBack={handleBack} />}
            {selectedMenu === "terms" && <Terms onBack={handleBack} />}
            {selectedMenu === "about" && <About onBack={handleBack} />}
          </div>
        )}
      </div>
    </div>
  );
}

function formatNumber(value) {
  if (value == null) return "0";
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}

export default Setting;