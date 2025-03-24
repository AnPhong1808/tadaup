import React from "react";
import "./PortFolio.css";
import moneystackIcon from "./assets/icons/money-stack.png"; // Icon tương tự hình mẫu
import balancecoinIcon from "./assets/icons/balance-coin.png";
import balanceincreaseIcon from "./assets/icons/balance-increase.png";
import balancebonusIcon from "./assets/icons/balance-bonus.png";

const Balance = ({ trading_accounts, accountMT5 }) => {
  // Tìm Trading Account có accountMT5 khớp
  const currentAccount = trading_accounts?.find(
    (account) => account.accountMT5 === accountMT5
  );

  // Nếu không tìm thấy Trading Account thì hiển thị thông báo
  if (!currentAccount) {
    return (
      <div className="incomechart-content-container">
        <p>Không tìm thấy Trading Account cho account {accountMT5}</p>
      </div>
    );
  }

  const incomeData = currentAccount.incomeCharts || [];

  const now = new Date();

// Xác định boundaries của tuần hiện tại theo UTC
// Lấy ngày hiện tại theo UTC
const dayOfWeekUTC = now.getUTCDay();
const diffToMondayUTC = dayOfWeekUTC === 0 ? 6 : dayOfWeekUTC - 1;

// Tạo startOfWeek theo UTC
const startOfWeekUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
startOfWeekUTC.setUTCDate(startOfWeekUTC.getUTCDate() - diffToMondayUTC);

// End of week: thứ Hai của tuần kế tiếp theo UTC
const endOfWeekUTC = new Date(startOfWeekUTC);
endOfWeekUTC.setUTCDate(startOfWeekUTC.getUTCDate() + 7);

// Lọc dữ liệu theo boundaries UTC
const weeklyIncomeData = incomeData.filter(item => {
  const itemDate = new Date(item.created_at);
  // So sánh theo UTC
  return itemDate >= startOfWeekUTC && itemDate < endOfWeekUTC;
});

  // Tính tổng Weekly Performance (nếu không có bản ghi nào của tuần này, kết quả sẽ là 0)
  const weeklyPerformance = weeklyIncomeData.reduce(
    (total, item) => total + Number(item.income_amount),
    0
  );

  return (
    <div className="incomechart-content-container">
  {/* Header Section */}
  <div className="portfolio-header">
    <div className="portfolio-header-title">
      <img src={moneystackIcon} alt="Balance Icon" className="portfolio-icon" />
      <span>Balance</span>
    </div>
    <div className="portfolio-divider-fullwidth" />
    <div className="balance-body">
      <div className="balance-list">
        <div className="balance-left">
          <img src={balancecoinIcon} alt="Balance Icon" className="balance-icon" />
          <div className="balance-title">Total Portfolio Value</div>
        </div>
        <span className="balance-amount">
          ${Number(currentAccount.balance ?? 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className="balance-list">
        <div className="balance-left">
          <img src={balanceincreaseIcon} alt="Balance Icon" className="balance-icon" />
          <div className="balance-title">Weekly Performance</div>
        </div>
        <span className="balance-amount">
          ${Number(weeklyPerformance ?? 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
      <div className="balance-list-end">
        <div className="balance-left">
          <img src={balancebonusIcon} alt="Balance Icon" className="balance-icon" />
          <div className="balance-title">Commisson</div>
        </div>
        <span className="balance-amount">
          ${Number(currentAccount.commission ?? 0).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      </div>
    </div>
  </div>
</div>

  );
};

export default Balance;
