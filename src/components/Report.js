import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatar from './assets/avatar.gif'; // Đường dẫn đến ảnh avatar
import './Report.css'; // Import CSS riêng
import targetIcon from '../components/assets/icons/target.png'; // Đảm bảo đường dẫn đúng

const Report = ({ userID, author, channel_id, price, walletAC, disccount, amount, onBuyAC, onClose }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Trạng thái chờ API
  const [registered, setRegistered] = useState(false); // Trạng thái đăng ký thành công
  const [responseData, setResponseData] = useState(null); // Dữ liệu API trả về
  const [error, setError] = useState(null); // Trạng thái lỗi

  // Xử lý khi nhấn "Register Now"
  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://admin.tducoin.com/api/signal/registrychannel", {
        method: "POST",
        headers: {
          "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: userID,
          author: author,
          channel_id: channel_id,
          price: price,
          amount: amount // Mặc định đăng ký 1 tháng nếu không nhập vào
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegistered(true);
        setResponseData(data.data); // Lưu dữ liệu API trả về để hiển thị
      
        // **Cập nhật sessionStorage**
        const storedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
      
        // Kiểm tra xem userData có chứa data không
        if (!storedUserData) {
          console.error("Dữ liệu userData không hợp lệ hoặc không có data.");
          return;
        }
      
        // Cập nhật mảng booking_channels
        const updatedBookingChannels = [
          ...storedUserData.booking_channels,
          { channel_id: channel_id, author: author }
        ];
      
        // Cập nhật wallet_AC
        const updatedWalletAC = data.data.wallet_balance_after;
      
        // Cập nhật lại userData với mảng booking_channels và wallet_AC mới
        const updatedUserData = {
          ...storedUserData,
          booking_channels: updatedBookingChannels,
          wallet_AC: updatedWalletAC
        };
 
        // Lưu lại vào sessionStorage
        sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
      
        // Phát sự kiện tùy chỉnh để cập nhật Header ngay lập tức
        window.dispatchEvent(new Event("walletUpdated"));

        // Gọi hàm cập nhật Header nếu có
        if (typeof window.updateHeaderWalletAC === "function") {
          window.updateHeaderWalletAC(updatedWalletAC);
        }
      } else {
        throw new Error(data.message || "Failed to register.");
      }
      
    } catch (error) {
      setError(error.message);
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

            {/* Giữ nguyên tên kênh */}
            <div className="report-box">
              <img src={targetIcon} alt="Target Icon" className="report-icon" />
              <span className="report-answer">
                Channel <b>{author}</b>
              </span>
            </div>

            {/* Nội dung thay đổi sau khi đăng ký thành công */}
            <div className="report-details">
              <p><b>Subscription Successful!</b></p>
              <p>You have successfully subscribed to <b>{author}</b>'s channel.</p>
              <p><b>Final Cost:</b> {responseData.final_cost} AC</p>
              <p><b>Discount Applied: </b> {responseData.discount_applied} AC</p>
              <p><b>Remaining Balance:</b> {responseData.wallet_balance_after} AC</p>
              <p><b>Subscription Valid Until: </b> 
                {responseData.followers && responseData.followers.length > 0
                  ? new Date(responseData.followers[0].done_at).toLocaleDateString()
                  : "N/A"}
              </p>
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

          {/* Giữ nguyên tên kênh */}
          <div className="report-box">
            <img src={targetIcon} alt="Target Icon" className="report-icon" />
            <span className="report-answer">
              Channel <b>{author}</b>
            </span>
          </div>

          {/* Hiển thị số dư và giá */}
          <div className="report-details">
            <p>You currently have <b>{walletAC} AC</b>. To subscribe to this signal channel, you will need <b>{price} AC</b>.</p>
            <p><i>
              {walletAC < price 
                ? "You do not have enough AC to subscribe. Please purchase more AC before proceeding." 
                : "Please confirm to proceed with the subscription!"}
            </i></p>
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <p className="error-message">{error}</p>}

          {/* Nút động thay đổi dựa trên điều kiện */}
          {walletAC < price ? (
            <button className="report-button" onClick={() => {
              onClose(); // Ẩn Report
              onBuyAC(); // Hiển thị BuyAC
            }}>
              Buy AC
            </button>
          ) : (
            <button className="report-button" onClick={handleRegister} disabled={loading}>
              {loading ? "Processing..." : "Register Now"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Report;