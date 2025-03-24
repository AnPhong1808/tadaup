import React, { useState } from 'react';
import { sendInlineKeyboard } from './TelegramNotification';
import avatar from './assets/avatar.gif';
import acIcon from "../components/assets/icons/coin-header.png";
import usdtIcon from "../components/assets/icons/usdt-large.png";
import transactionIcon from "../components/assets/icons/transaction.png";
import './Report.css';
import './BuyAC.css';

const Swap = ({ userID, totalCommission, addressWallet, onClose, onUpdateTotalCommission }) => {
  const [acAmount, setAcAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [error, setError] = useState(null);
  const [isSwapped, setIsSwapped] = useState(false);
  const [tempAddressWallet, setTempAddressWallet] = useState(addressWallet || '');
  const [isWalletEntered, setIsWalletEntered] = useState(!!addressWallet);
  const [isSuccess, setIsSuccess] = useState(false);

  // Hàm chuyển đổi giá trị giữa AC và USDT
  const handleChangeAmount = (event) => {
    const inputValue = event.target.value;
    if (isSwapped) {
      setUsdtAmount(inputValue);
      setAcAmount(inputValue ? inputValue * 10 : '');
    } else {
      setAcAmount(inputValue);
      setUsdtAmount(inputValue ? inputValue / 10 : '');
    }
  };

  // Hàm gọi API để cập nhật địa chỉ ví
  const updateWalletAddress = async () => {
    try {
      const response = await fetch('https://admin.tducoin.com/api/webappuser/updateinfo/9999', {
        method: 'POST',
        headers: {
          'x-api-key': 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addressWallet: tempAddressWallet,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Wallet address updated successfully:', data);

      const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
      userData.addressWallet = tempAddressWallet;
      sessionStorage.setItem('userData', JSON.stringify(userData));
      console.log('Updated sessionStorage with addressWallet:', userData);

      setIsWalletEntered(true);
      setError(null);
    } catch (error) {
      console.error('Error updating wallet address:', error);
      setError('Failed to update wallet address. Please try again.');
    }
  };

  // Hàm gọi API để trừ AC từ totalCommission
  const subtractACBonus = async () => {
    try {
      if (!acAmount || isNaN(acAmount) || parseFloat(acAmount) <= 0) {
        setError('Please enter a valid amount of AC.');
        return false;
      }

      const userIdNumber = parseInt(userID, 10);
      if (isNaN(userIdNumber)) {
        setError('Invalid user ID.');
        return false;
      }

      console.log('Calling subtractbonus API with:', { userID: userIdNumber, ac_bonus: parseFloat(acAmount) });
      const response = await fetch('https://admin.tducoin.com/api/addbonus/subtractbonus', {
        method: 'POST',
        headers: {
          'x-api-key': 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userID: userIdNumber,
          ac_bonus: parseFloat(acAmount),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Subtract AC bonus response:', data);

      // Cập nhật sessionStorage
      const userData = JSON.parse(sessionStorage.getItem('userData')) || {};
      const newTotalCommission = (userData.totalCommission || 0) - parseFloat(acAmount);
      userData.totalCommission = newTotalCommission; // Sửa lỗi typo từ "totalCommisison" thành "totalCommission"
      sessionStorage.setItem('userData', JSON.stringify(userData));
      console.log('Updated sessionStorage with new totalCommission:', userData);

      // Gọi callback
      if (onUpdateTotalCommission) {
        console.log('Calling onUpdateTotalCommission with:', newTotalCommission);
        onUpdateTotalCommission(newTotalCommission);
      }

      return true;
    } catch (error) {
      console.error('Error subtracting AC bonus:', error);
      setError('Failed to subtract AC bonus. Please try again.');
      return false;
    }
  };

  // Hàm xử lý khi nhấn Confirm
  const handleConfirmTransaction = async () => {
    const amount = isSwapped ? usdtAmount : acAmount;
    if (amount <= 0 || isNaN(amount)) {
      setError('Please enter a valid amount.');
      return;
    }

    if (parseFloat(acAmount) > (totalCommission || 0)) {
      setError('Insufficient AC balance.');
      return;
    }

    const isSubtractSuccess = await subtractACBonus();
    if (!isSubtractSuccess) {
      return;
    }

    sendInlineKeyboard(
      `Có user ID là ${userID} yêu cầu chuyển ${acAmount} AC, tương đương ${usdtAmount} USDT. Địa chỉ ví user là ${tempAddressWallet}. Hãy chuyển tiền cho user này rồi báo cho em biết với nha chị Thảo!`,
      'Confirm',
      `swapacusdt-${userID}-${acAmount}-${usdtAmount}`
    );

    setIsSuccess(true); // Chuyển sang trạng thái thành công, không gọi handleTransaction nữa
  };

  // Hàm hoán đổi giá trị giữa AC và USDT
  const handleSwap = () => {
    setIsSwapped(!isSwapped);
    setAcAmount(usdtAmount);
    setUsdtAmount(acAmount);
  };

  return (
    <>
      <div className="overlay"></div>
      <div className="report-container">
        <div className="report-card">
          <button className="close-button" onClick={onClose}>X</button>
          <img src={avatar} alt="Avatar" className="report-avatar" />

          <div className="buyac-details">
            {/* Trường hợp giao dịch thành công */}
            {isSuccess ? (
              <div className="success-container">
                <p className="success-message">
                  Success! The process will be handled within a maximum of 12 hours.
                </p>
              </div>
            ) : (
              <>
                <p><b>User ID:</b> {userID}</p>
                <p><b>Total commission:</b> {totalCommission || 0} AC</p>

                {!isWalletEntered && (
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Enter your wallet address"
                      value={tempAddressWallet}
                      onChange={(e) => setTempAddressWallet(e.target.value)}
                    />
                  </div>
                )}

                {isWalletEntered && (
                  <div className="swap-container">
                    <div className="input-wrapper">
                      <input
                        type="number"
                        placeholder={`Enter the amount of ${isSwapped ? 'USDT' : 'AC'}`}
                        value={isSwapped ? usdtAmount : acAmount}
                        onChange={handleChangeAmount}
                      />
                    </div>
                    <div className="swap-icon" onClick={handleSwap}>
                      <img src={transactionIcon} alt="Swap Icon" />
                    </div>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        placeholder={`Amount in ${isSwapped ? 'AC' : 'USDT'}`}
                        value={isSwapped ? acAmount : usdtAmount}
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {error && <p className="error-message">{error}</p>}
              </>
            )}

            {/* Nút Confirm/Submit chỉ hiển thị trước khi thành công */}
            {!isSuccess && (
              <button onClick={isWalletEntered ? handleConfirmTransaction : updateWalletAddress}>
                {isWalletEntered ? 'Confirm' : 'Submit'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Swap;