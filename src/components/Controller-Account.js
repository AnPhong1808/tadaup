import React, { useState, useRef, useEffect } from "react";
import controllermoreIcon from "./assets/icons/controller-more.png";
import upIcon from "./assets/icons/up.png";
import downIcon from "./assets/icons/down.png";
import "./Signal.css";
import "./Controller-Account.css";

const ControllerAccount = ({ userID, index, accountMT5, trading_accounts, onUserDataUpdate }) => {
  const [localAccounts, setLocalAccounts] = useState(trading_accounts);
  const accountData = localAccounts?.find(account => account.accountMT5 === accountMT5) || {};

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [loading, setLoading] = useState(false);

  // 📌 Đồng bộ localAccounts khi trading_accounts thay đổi
   useEffect(() => {
    setLocalAccounts(trading_accounts);
  }, [trading_accounts]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    } else {
      setDropdownHeight(0);
    }
  }, [isDropdownOpen]);

  // 📌 Gọi API để cập nhật trạng thái khi nhấn nút Inactive
  const handleActivateAccount = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("https://admin.tducoin.com/api/webappuser/tradingaccount", {
        method: "POST",
        headers: {
          "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userID,
          accountMT5: accountMT5,
          status: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // 📌 Cập nhật toàn bộ danh sách tài khoản
        const updatedAccounts = localAccounts.map((account) => ({
          ...account,
          status: account.accountMT5 === accountMT5 ? 1 : 0, // Đặt 1 tài khoản active, các tài khoản khác inactive
        }));

        // 📌 Cập nhật sessionStorage ngay lập tức
        const userData = JSON.parse(sessionStorage.getItem("userData")) || {};
        userData.trading_accounts = updatedAccounts;
        sessionStorage.setItem("userData", JSON.stringify(userData));

        // 📌 Cập nhật UI ngay lập tức
        setLocalAccounts(updatedAccounts); // Cập nhật state nội bộ component
        onUserDataUpdate(updatedAccounts); // Gửi danh sách mới về FundBot.js để toàn bộ UI cập nhật
      } else {
        console.error("API Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch API failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signal-container">
      {/* Header */}
      <div className="signal-header">
        <div className="account-header-title">
          <img src={controllermoreIcon} alt="Balance Icon" className="portfolio-icon" />
          <span>Account {index + 1}</span>
        </div>
        <button
          className={`account-header-button ${accountData?.status === 1 ? "active" : "inactive"}`}
          disabled={accountData?.status === 1 || loading}
          onClick={accountData?.status === 0 ? handleActivateAccount : undefined}
        >
          {loading ? "Updating..." : accountData?.status === 1 ? "Active" : "Inactive"}
        </button>
      </div>

      {/* Body */}
      <div className="signal-body">
        <div className="signal-body-item">
          <span className="icon">🪪</span>
          <span className="text">Account MT5</span>
          <span>{accountMT5}</span>
        </div>
        <div className="signal-body-item">
          <span className="icon">🔒</span>
          <span className="text">Password</span>
          <span>{accountData?.passwordMT5 || "N/A"}</span>
        </div>
        <div className="signal-body-item">
          <span className="icon">🌐</span>
          <span className="text">Address Server</span>
          <span>{accountData?.addressServer || "N/A"}</span>
        </div>

        {/* Dropdown - Following Channels */}
        <div className="signal-body-item">
          <div className="dropdown">
            <div className="dropdown-header" onClick={toggleDropdown}>
              <span className="text">Following channels</span>
              <span className="dropdown-arrow">
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
              {accountData?.following_channels?.length > 0 ? (
                accountData.following_channels.map((channel, index) => (
                  <div key={index} className="account-dropdown-item">
                    <span><b>{channel.author}</b></span>
                    <span>{channel.done_at ? new Date(channel.done_at).toLocaleString() : "Free time"}</span>
                  </div>
                ))
              ) : (
                <div className="account-dropdown-item">
                  <span>Don't follow any channels</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="signal-footer">
        <div className="signal-text-footer">
          <div>Expiration date: {accountData.done_at}</div>
        </div>
      </div>
    </div>
  );
};

export default ControllerAccount;
