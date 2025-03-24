import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Thêm hook useNavigate
import TelegramNotification, { sendTadaServer1Message } from './TelegramNotification'; 
import upIcon from "./assets/icons/up.png";
import downIcon from "./assets/icons/down.png";
import profitsIcon from "./assets/icons/profits.png";
import "./Signal.css";

const Signal = React.forwardRef(({
  id,
  signalID,
  userID,
  accountMT5,
  author,
  avatar,
  margin,
  SL,
  E1,
  TP1,
  TP2,
  TP3,
  command,
  created_at,
  status,
  freetrading,
  autoCopy,
  done_at,
  R_result,
  port_id,
  onUpdateFreeTrading
}, ref) => {
  const navigate = useNavigate(); // Sử dụng hook useNavigate
  console.log(done_at);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [userData, setUserData] = useState(() => {
    const cachedUserData = sessionStorage.getItem("userData");
    return cachedUserData ? JSON.parse(cachedUserData) : null;
  });

  const toggleDropdown = () => {
    if (isDropdownOpen) {
      setDropdownHeight(0);
    } else if (dropdownRef.current) {
      const scrollHeight = dropdownRef.current.scrollHeight;
      setDropdownHeight(scrollHeight);
    }
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Cập nhật height nếu nội dung dropdown thay đổi
  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    }
  }, [isDropdownOpen]);

  // Gửi tin nhắn đến Telegram nếu autoCopy = 0 và người dùng nhấn vào nút
  const handleTelegramNotification = async () => {
    if (autoCopy === 0) {
      // ✅ Gửi POST request lên API
      const apiUrl = "https://admin.tducoin.com/api/signal/addfreetrading";
      const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

      const requestData = {
        userID: userID,
        accountMT5: accountMT5,
        signalID: signalID,
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          sendTelegramMessage("❌ Lỗi khi gọi API:", await response.text());
        }

        lastConfigString = await response.text();
        await sendTadaServer1Message(`${lastConfigString},port_id:${port_id}`);

        // ✅ Kiểm tra userData trước khi cập nhật
        if (!userData || !userData.trading_accounts) {
          sendTelegramMessage("❌ Lỗi: Không tìm thấy thông tin tài khoản.");
          return;
        }

        // Lấy dữ liệu từ sessionStorage
        const storedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};

        // Kiểm tra xem userData có chứa trading_accounts không
        if (!Array.isArray(storedUserData.trading_accounts)) {
          sendTelegramMessage("Dữ liệu userData không hợp lệ hoặc không có trading_accounts.");
          return;
        }

        // Cập nhật danh sách freetrading trong tất cả các account
        const updatedTradingAccounts = storedUserData.trading_accounts.map((account) => {
          if (account.accountMT5 === accountMT5) {
            return {
              ...account,
              freetrading: [...(account.freetrading || []), { accountMT5, signalID }],
            };
          }
          return account;
        });

        // Cập nhật lại userData với danh sách tài khoản đã chỉnh sửa
        const updatedUserData = {
          ...storedUserData,
          trading_accounts: updatedTradingAccounts,
        };

        // Lưu lại vào sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
        // Cập nhật state
        setUserData(updatedUserData);

        // ✅ Cập nhật state trong component cha (Earn.js)
        if (onUpdateFreeTrading) {
          onUpdateFreeTrading(signalID); // Cập nhật freeTradingList
        }
      } catch (error) {
        sendTelegramMessage("❌ Lỗi kết nối API:" + error);
      }
    }
  };

  // ✅ Xác định class của button
  let buttonClass = "signal-header-button1"; // Mặc định là button2 (khóa)
  let buttonOnClick = undefined; // Mặc định không có sự kiện

  if (status === 0) {
    buttonClass = "signal-header-button2"; // Giữ nguyên khóa
  } else {
    if (freetrading === 1 && autoCopy === 0) {
      // ✅ Nếu tín hiệu đã có trong Free Trading nhưng chưa bật autoCopy
      buttonClass = "signal-header-button1"; // Giữ nguyên khóa
    } else if (freetrading === 1 && autoCopy === 1) {
      // ✅ Nếu autoCopy đã bật
      buttonClass = "signal-header-button1";
    } else if (freetrading === 0 && autoCopy === 0) {
      // ✅ Nếu tín hiệu mở và không thuộc Free Trading
      buttonClass = "signal-header-button3";
      buttonOnClick = handleTelegramNotification;
    } else if (freetrading === 0 && autoCopy === 1) {
      buttonClass = "signal-header-button1";
    }
  }

  // Xử lý khi nhấn vào nút Customize
  const handleCustomizeClick = () => {
    navigate(`/signaldetail/${id}?autoCopy=${autoCopy}`);
  };

  return (
    <div ref={ref} className="signal-container">
      {/* Header */}
      <div className="signal-header">
        <div className="header-left">
          <div
            className="signal-avatar"
            style={{
              backgroundImage: avatar ? `url(${avatar})` : "none",
            }}
          ></div>
          <div className="header-text">
            <div className="author">{author}</div>
            <div className="margin">{margin}</div>
          </div>
        </div>
        <button className={buttonClass} onClick={buttonOnClick}>
          {status === 1
            ? command === 1
              ? "Buy"
              : command === 0
              ? "Sell"
              : "Unknown"
            : "Lock signal"}
        </button>
      </div>

      {/* Body */}
      {status === 1 && (
        <div className="signal-body">
          <div className="signal-body-item">
            <span className="icon">📉</span>
            <span className="text">Stop Loss</span>
            <span>{SL}</span>
          </div>
          <div className="signal-body-item">
            <span className="icon">📈</span>
            <span className="text">Entry</span>
            <span>{E1}</span>
          </div>

          {/* Hiển thị Target và dropdown nếu done_at === null */}
          {done_at === null ? (

              <div className="dropdown">
                <div
                  className="dropdown-header"
                  onClick={toggleDropdown}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span className="text" style={{ flex: 1, textAlign: "left" }}>Targets</span>
                  <span className="dropdown-arrow" style={{ textAlign: "right", flex: 0 }}>
                    <img src={isDropdownOpen ? upIcon : downIcon} alt="Toggle Icon" className="dropdown-icon" />
                  </span>
                </div>
                <div
                  ref={dropdownRef}
                  className="dropdown-menu"
                  style={{
                    height: `${dropdownHeight}px`,
                    overflow: "hidden",
                    transition: "height 0.3s ease-in-out",
                  }}
                >
                  <div className="dropdown-item">
                    <span>Take Profit 1</span>
                    <span>{TP1}</span>
                  </div>
                  <div className="dropdown-item">
                    <span>Take Profit 2</span>
                    <span>{TP2}</span>
                  </div>
                  <div className="dropdown-item">
                    <span>Take Profit 3</span>
                    <span>{TP3}</span>
                  </div>
                </div>

            </div>
          ) : (
            // Hiển thị Result nếu done_at !== null
            <div className="signal-body-item">
              <span className="icon">✅</span>
              <span className="text">Result:</span>
              <span><b>{R_result || 0} R</b></span>
            </div>
          )}
          {/* Nút Customize nằm dưới dropdown */}
          {done_at === null &&<button className="signal-mainternaire-button" onClick={handleCustomizeClick}>
            Customize
            <img 
              src={profitsIcon} 
              alt="Profits Icon" 
              className="signal-mainternaire-icon"
            />
          </button>}
        </div>
      )}

      {/* Footer */}
      <div className="signal-footer">
        <div className="signal-text-footer">
          <div><b>Opened:</b> {created_at}</div>
        </div>
        <div className="signal-text-footer">
          {done_at !== null && <div><b>Closed:</b> {done_at}</div>}
        </div>
      </div>
    </div>
  );
});

export default Signal;