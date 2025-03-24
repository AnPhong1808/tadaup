import React, { useState, useEffect } from "react";
import "./Signal.css";
import "./Controller-Strategy.css";
import controllermoreIcon from "./assets/icons/controller-more.png";
import TelegramNotification, { sendTadaServer1Message } from './TelegramNotification';

const ControllerMore = ({ userID, accountMT5, port_id, onUserDataUpdate }) => {
  const [isisEntryOn, setIsisEntryOn] = useState(false);
  const [isisReverseOn, setIsisReverseOn] = useState(false);
  const [isModified, setIsModified] = useState(false);

  // 🔥 Hàm cập nhật state từ sessionStorage (Load dữ liệu mới nhất)
  const updateStateFromStorage = () => {
    const cachedUserData = JSON.parse(sessionStorage.getItem("userData"));

    if (cachedUserData && Array.isArray(cachedUserData.trading_accounts)) {
      const currentAccount = cachedUserData.trading_accounts.find(
        (account) => account.accountMT5 === accountMT5
      );
      if (currentAccount && Array.isArray(currentAccount.following_channels)) {
        const followingChannels = currentAccount.following_channels;

        // Kiểm tra xem tất cả channels có isEntry = 1 không
        const allIsEntryOn = followingChannels.length > 0 && 
          followingChannels.every((channel) => channel.isEntry === 1);
        setIsisEntryOn(allIsEntryOn);

        // Kiểm tra xem tất cả channels có isReverse = 1 không
        const allisReverseOn = followingChannels.length > 0 && 
          followingChannels.every((channel) => channel.isReverse === 1);
        setIsisReverseOn(allisReverseOn);
      }
    }
  };

  // 🔥 Khi component mount, lấy dữ liệu từ sessionStorage
  useEffect(() => {
    updateStateFromStorage();
  }, [accountMT5]);

  // 🔥 Hàm xử lý khi nhấn nút Save
  const handleSave = async () => {
    try {
      const cachedUserData = JSON.parse(sessionStorage.getItem("userData"));
      if (!cachedUserData || !Array.isArray(cachedUserData.trading_accounts)) {
        throw new Error("Không tìm thấy dữ liệu tài khoản trong sessionStorage");
      }

      const currentAccount = cachedUserData.trading_accounts.find(
        (account) => account.accountMT5 === accountMT5
      );
      if (!currentAccount || !Array.isArray(currentAccount.following_channels)) {
        throw new Error("Không tìm thấy tài khoản hoặc danh sách channels");
      }

      const followingChannels = currentAccount.following_channels;
      let lastConfigString = ""; // Lưu config của lần gọi API cuối cùng
      let apiCallCount = 0; // Đếm số lần gọi API

      // Gửi API tuần tự cho từng channel
      for (const channel of followingChannels) {
        const payload = {
          userID: userID,
          accountMT5: accountMT5,
          channel_id: channel.channel_id,
          isEntry: isisEntryOn ? 1 : 0,
          isReverse: isisReverseOn ? 1 : 0,
        };

        console.log(`Gửi API cho channel ${channel.channel_id} (lần ${apiCallCount + 1}):`, payload);

        // Gọi API POST
        const response = await fetch("https://admin.tducoin.com/api/signal/channelcontroller", {
          method: "POST",
          headers: {
            "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        apiCallCount++; // Tăng số lần gọi API

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("API Error Response cho channel", channel.channel_id, ":", errorResponse);
          <TelegramNotification
            message={
              "Lỗi POST Save tùy chỉnh component More Options cho channel " +
              channel.channel_id +
              ": " +
              errorResponse.message +
              " từ user " +
              userID
            }
          />;
          throw new Error(`API thất bại cho channel ${channel.channel_id}`);
        }

        // Lấy dữ liệu trả về từ API (chuỗi config)
        lastConfigString = await response.text();
        console.log(`Config từ API cho channel ${channel.channel_id}:`, lastConfigString);
      }

      // Gửi tin nhắn Telegram chỉ một lần với config cuối cùng
      if (apiCallCount > 0) {
        const message = `${lastConfigString},${port_id}`;
        await sendTadaServer1Message(message);
      }

      // 🔥 Cập nhật sessionStorage ngay sau khi API thành công
      const updatedTradingAccounts = cachedUserData.trading_accounts.map((account) =>
        account.accountMT5 === accountMT5
          ? {
              ...account,
              following_channels: account.following_channels.map((channel) => ({
                ...channel,
                isEntry: isisEntryOn ? 1 : 0, // Cập nhật tất cả channels
                isReverse: isisReverseOn ? 1 : 0, // Giữ nguyên tên isReverse
              })),
            }
          : account
      );

      const updatedUserData = {
        ...cachedUserData,
        trading_accounts: updatedTradingAccounts,
      };

      // Lưu vào sessionStorage
      sessionStorage.setItem("userData", JSON.stringify(updatedUserData));

      // 🔥 Cập nhật UI từ dữ liệu mới
      setIsisEntryOn(isisEntryOn);
      setIsisReverseOn(isisReverseOn);
      setIsModified(false);

      // 🔥 Gọi callback để cập nhật `FundBot.js`
      if (onUserDataUpdate) {
        onUserDataUpdate(updatedTradingAccounts);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      <TelegramNotification
        message={
          "Lỗi POST Save tùy chỉnh component More Options: " +
          error.message +
          " từ user " +
          userID
        }
      />;
      alert(`Failed to save settings. Error: ${error.message}`);
    }
  };

  return (
    <div className="signal-container">
      <div className="portfolio-header-title">
        <img src={controllermoreIcon} alt="Balance Icon" className="portfolio-icon" />
        <span>More Options</span>
      </div>
      <hr className="portfolio-divider-fullwidth" />

      <div className="signal-body">
        {/* Place Stop Loss to Entry */}
        <div className="signal-body-item">
          <span className="icon">⚖️</span>
          <span className="text">Place Stop Loss to Entry</span>
          <div className="strategy-toggle">
            <div
              className={`strategy-switch ${isisEntryOn ? "on" : "off"}`}
              onClick={() => {
                setIsisEntryOn(!isisEntryOn);
                setIsModified(true);
              }}
            >
              <div className="strategy-knob"></div>
            </div>
          </div>
        </div>

        {/* Trade against all auto-followed signals */}
        <div className="signal-body-item">
          <span className="icon">🧠</span>
          <span className="text">Trade against all auto-followed signals</span>
          <div className="strategy-toggle">
            <div
              className={`strategy-switch ${isisReverseOn ? "on" : "off"}`}
              onClick={() => {
                setIsisReverseOn(!isisReverseOn);
                setIsModified(true);
              }}
            >
              <div className="strategy-knob"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Nút Save */}
      {isModified && (
        <div className="strategy-footer">
          <button className="strategy-footer-button" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ControllerMore;