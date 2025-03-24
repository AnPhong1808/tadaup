import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from './assets/avatar.gif'; // Đường dẫn đến ảnh avatar
import './Report.css'; // Import CSS riêng
import { sendTelegramMessage, sendInlineKeyboard } from './TelegramNotification';

const ReportBot = ({ userID, price, walletAC, disccount, amount, onBuyAC, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Trạng thái chờ API
  const [registered, setRegistered] = useState(false); // Trạng thái đăng ký thành công
  const [responseData, setResponseData] = useState(null); // Dữ liệu API trả về
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [showMT5Form, setShowMT5Form] = useState(false); // Trạng thái hiển thị form MT5
  const [mt5Account, setMT5Account] = useState(''); // State cho account MT5
  const [mt5Password, setMT5Password] = useState(''); // State cho password MT5
  const [mt5Server, setMT5Server] = useState(''); // State cho address server

  // Xử lý khi nhấn "Register Now"
  const handleRegister = async () => {
    if (!showMT5Form) {
      setShowMT5Form(true); // Hiển thị form nhập liệu MT5
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://admin.tducoin.com/api/webappuser/tradingaccount", {
        method: "POST",
        headers: {
          "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userID,
          accountMT5: mt5Account, // Thêm account MT5
          passwordMT5: mt5Password, // Thêm password MT5
          addressServer: mt5Server, // Thêm address server
          price: price
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistered(true);
        setResponseData(data.data); // Lưu dữ liệu API trả về để hiển thị

        // 🔥 Cập nhật sessionStorage ngay sau khi tạo tài khoản trading
        const storedUserData = sessionStorage.getItem("userData");
        let userData = storedUserData ? JSON.parse(storedUserData) : { trading_accounts: [] };

        // Đảm bảo `trading_accounts` tồn tại và thêm tài khoản mới
        userData.trading_accounts = [
          ...userData.trading_accounts,
          {
            accountMT5: mt5Account,
            passwordMT5: mt5Password, // Thêm password MT5
            addressServer: mt5Server, // Thêm address server
          }
        ];
        userData.wallet_AC = walletAC - price;

        // Lấy port_id từ data.data.tradingAccount
        const portId = data.data.tradingAccount.port_id;
        sendInlineKeyboard(
          `Có user ID là ${userID} vừa đăng ký tài khoản trading với thông tin như sau \nAccountMT5: ${mt5Account} \nPasswordMT5: ${mt5Password}, \nPasswordMT5: ${mt5Server}, \nPort ID: ${portId} \nHãy setup VPS tài khoản cho user này và xác nhận giùm em khi hoàn tất nhé anh Thỏ?!`,
          'Xác nhận đã setup VPS',
          `setupVPS,${userID},${mt5Account}`
        );
          // Lưu lại vào sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(userData));

        window.dispatchEvent(new Event("walletUpdated"));

      } else {
        sendTelegramMessage(data.message);     
      }
    } catch (error) {
      sendTelegramMessage (error.message);
    }

    setLoading(false);
  };

  // Nếu đã đăng ký thành công, thay đổi nội dung component (trừ avatar và tên author)
  if (registered && responseData) {
    return (
      <>
        <div className="overlay"></div>
        <div className="report-container">
          <div className="report-card">
            <button className="close-button" onClick={onClose}>X</button>
            <img src={avatar} alt="Avatar" className="report-avatar" />

            {/* Nội dung thay đổi sau khi đăng ký thành công */}
            <div className="report-details">
              <p><b>Registration Successful!</b></p>
              <p>The technical team will need time to set up your account. Please allow up to 12 hours for processing.</p>
            </div>
          </div>
        </div>
      </>
    );
  }
  // Nếu có lỗi từ API, hiển thị thông báo lỗi thay vì form
  if (error) {
    return (
      <>
        <div className="overlay"></div>
        <div className="report-container">
          <div className="report-card">
            <button className="close-button" onClick={onClose}>X</button>
            <img src={avatar} alt="Avatar" className="report-avatar" />
            <div className="report-details">
              <p>Please book the signal channel you want to follow before registering a trading bot account!!!!</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="overlay"></div>
      <div className="report-container">
        <div className="report-card">
          <button className="close-button" onClick={onClose}>X</button>
          <img src={avatar} alt="Avatar" className="report-avatar" />

          {/* Hiển thị số dư và giá (chỉ hiển thị khi không show form MT5) */}
          {!showMT5Form && (
            <div className="report-details">
              <p>You currently have <b>{walletAC} AC</b>. To sign-up and use Fund Bot for 01 trading account, you will need <b>{price} AC</b>.</p>
              <p><i>
                {walletAC < price
                  ? "You do not have enough AC to subscribe. Please purchase more AC before proceeding."
                  : "Please confirm to proceed with the subscription!"}
              </i></p>
            </div>
          )}


          {/* Hiển thị form nhập liệu MT5 nếu showMT5Form là true */}
          {showMT5Form && (
            <div className="buyac-details">
              <p>Please tell me the account you want to register for FundBot</p>
              <input
                type="text"
                placeholder="MT5 Account"
                value={mt5Account}
                onChange={(e) => setMT5Account(e.target.value)}
              />
              <input
                type="password"
                placeholder="MT5 Password"
                value={mt5Password}
                onChange={(e) => setMT5Password(e.target.value)}
              />
              <input
                type="text"
                placeholder="MT5 Server Address"
                value={mt5Server}
                onChange={(e) => setMT5Server(e.target.value)}
              />
            </div>
          )}

          {/* Hiển thị lỗi nếu có */}
          {error && <p className="error-message">{error}</p>}

          {/* Nút động thay đổi dựa trên điều kiện */}
          {walletAC < price ? (
            <button className="reportbot-button" onClick={() => {
              onClose(); // Ẩn Report
              onBuyAC(); // Hiển thị BuyAC
            }}>
              Buy AC
            </button>
          ) : (
            <button className="reportbot-button" onClick={handleRegister} disabled={loading}>
              {loading ? "Processing..." : (showMT5Form ? "Confirm Registration" : "Register Now")}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportBot;
