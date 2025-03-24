import React, { useState, useEffect } from 'react';
import { sendInlineKeyboard } from './TelegramNotification'; // Import hàm gửi thông báo Telegram
import avatar from './assets/avatar.gif'; // Đường dẫn đến ảnh avatar
import qrcode from './assets/QR-Code.jpg'; // Đường dẫn đến ảnh QR code
import './Report.css'; // Import CSS riêng
import './BuyAC.css'; // Import CSS của BuyAC

const BuyAC = ({ userID, walletAC, onClose }) => {
  const [acAmount, setAcAmount] = useState(0); // Lưu số lượng AC muốn mua
  const [error, setError] = useState(null); // Trạng thái lỗi
  const [showQRCode, setShowQRCode] = useState(false); // Hiển thị QR code sau khi confirm
  const [timeLeft, setTimeLeft] = useState(600); // 10 phút = 600 giây
  const [transactionConfirmed, setTransactionConfirmed] = useState(false); // Trạng thái giao dịch đã xác nhận
  const [initialWalletAC, setInitialWalletAC] = useState(walletAC); // Lưu giá trị wallet_AC ban đầu

  const handleChangeAmount = (event) => {
    setAcAmount(event.target.value); // Cập nhật số lượng AC khi nhập
  };

  const handleRegister = () => {
    if (acAmount <= 0) {
      setError('Please enter a valid amount of AC.');
      return;
    }

    setError(null); // Reset lỗi nếu có
    setShowQRCode(true); // Hiển thị QR code và bắt đầu bộ đếm ngược

    // Gửi thông báo Telegram khi người dùng nhấn Confirm
    sendInlineKeyboard(
      `Có user ID là ${userID} đăng ký mua ${acAmount} AC, tương đương ${usdtAmount} USDT. Hãy theo dõi tài khoản hệ thống có nhận được tiền chưa nha chị Thảo?!`,
      'Xác nhận nạp tiền thành công',
      `buyAC-${userID}-${acAmount}`
    );

    // Bắt đầu kiểm tra giao dịch
    checkWalletAC();
  };

  // Tính số tiền USDT cần trả (1 USDT = 10 AC)
  const usdtAmount = acAmount / 10;

  // Cài đặt bộ đếm thời gian ngược
  useEffect(() => {
    if (showQRCode && timeLeft > 0 && !transactionConfirmed) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000); // Cập nhật mỗi giây

      // Dọn dẹp bộ đếm thời gian khi component unmount hoặc khi thời gian kết thúc
      return () => clearInterval(timer);
    }
  }, [showQRCode, timeLeft, transactionConfirmed]);

  // Hàm chuyển đổi thời gian còn lại thành định dạng phút:giây
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const checkWalletAC = () => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`https://admin.tducoin.com/api/webappuser/checkac/${userID}`, {
          method: 'GET',
          headers: {
            'x-api-key': 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        const currentWalletAC = data.wallet_AC;

        if (currentWalletAC !== initialWalletAC) {
          setTransactionConfirmed(true); // Giao dịch thành công
          clearInterval(interval); // Dừng việc kiểm tra sau khi nhận được giao dịch
          setShowQRCode(false); // Ẩn QR code và bộ đếm thời gian

          // Cập nhật sessionStorage
          const storedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
          const updatedUserData = {
            ...storedUserData,
            wallet_AC: currentWalletAC, // Cập nhật wallet_AC
          };
          sessionStorage.setItem("userData", JSON.stringify(updatedUserData));

          // Phát sự kiện tùy chỉnh để cập nhật Header ngay lập tức
          window.dispatchEvent(new Event("walletUpdated"));

          // Gọi hàm cập nhật Header nếu có
          if (typeof window.updateHeaderWalletAC === "function") {
            window.updateHeaderWalletAC(currentWalletAC);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu wallet_AC:', error);
      }

      if (timeLeft <= 0) {
        clearInterval(interval); // Dừng khi hết thời gian
        setError('Hết thời gian. Vui lòng thử lại.');
        setShowQRCode(false); // Ẩn QR code và bộ đếm thời gian
      }
    }, 10000); // Kiểm tra mỗi 10 giây
  };

  return (
    <>
      <div className="overlay"></div>
      <div className="report-container">
        <div className="report-card">
          <button className="close-button" onClick={onClose}>X</button>
          <img src={avatar} alt="Avatar" className="report-avatar" />

          {/* Nếu chưa nhấn Confirm, hiển thị các thông tin */}
          {!showQRCode && !transactionConfirmed && (
            <div className="buyac-details">
              <p><b>User ID:</b> {userID}</p>
              <p><b>Wallet AC:</b> {walletAC} AC</p>
              <input
                type="number"
                placeholder="Enter the quantity of AC you need..."
                value={acAmount}
                onChange={handleChangeAmount}
              />

              {/* Ghi chú về số tiền USDT cần trả */}
              <p className="note">
                USDT you need to pay: <b>{usdtAmount} USDT</b>
              </p>

              {/* Hiển thị lỗi nếu có */}
              {error && <p className="error-message">{error}</p>}

              {/* Nút động thay đổi dựa trên điều kiện */}
              <button onClick={handleRegister} disabled={acAmount <= 0}>
                Confirm
              </button>
            </div>
          )}

          {/* Nếu đã nhấn Confirm, hiển thị QR code và bộ đếm thời gian */}
          {showQRCode && !transactionConfirmed && (
            <div className="qr-container">
              <img src={qrcode} alt="QR Code" className="qr-code" />
              <p><i>Please transfer USDT to the wallet address provided above!</i></p>
              <p>Time Left: <b>{formatTime(timeLeft)}</b></p>
              {timeLeft === 0 && <p>Time Expired. Please try again.</p>} {/* Hiển thị khi hết thời gian */}
            </div>
          )}

          {/* Nếu giao dịch thành công, hiển thị thông báo "Successful!!!" */}
          {transactionConfirmed && (
            <div className="success-message">
              <p>Successful!!!</p>
            </div>
          )}

          {/* Nếu hết thời gian, hiển thị thông báo "Thời gian giao dịch quá hạn" */}
          {timeLeft <= 0 && !transactionConfirmed && (
            <div className="error-message">
              <p>Thời gian giao dịch quá hạn.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BuyAC;
