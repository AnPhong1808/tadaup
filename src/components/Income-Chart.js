import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./PortFolio.css";
import piechartIcon from "./assets/icons/pie-chart.png";

// Đăng ký các component cần thiết cho ChartJS
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const IncomeChart = ({ trading_accounts, accountMT5 }) => {
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

  // Lấy incomeCharts từ Trading Account, nếu không có thì mặc định là mảng rỗng
  const chartData = currentAccount.income_charts || [];

  const [timeframe, setTimeframe] = useState("7-Days");

  // Sử dụng useMemo để chuyển đổi và nhóm dữ liệu theo timeframe
  const parsedData = useMemo(() => {
    const groupedData = {
      "7-Days": [],
      Month: [],
      Year: new Map(),
      Decade: new Map(),
    };

    if (chartData.length > 0) {
      const now = new Date();
      // Sắp xếp dữ liệu theo created_at giảm dần
      const sortedData = [...chartData].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      // 1. Timeframe "7-Days": lấy 7 bản ghi mới nhất (giả sử mỗi bản ghi ứng với 1 ngày)
      const last7Days = sortedData.slice(0, 7).reverse();
      last7Days.forEach(({ income_amount, created_at }) => {
        const date = new Date(created_at);
        const label = `${date.getDate()}/${date.getMonth() + 1}`;
        groupedData["7-Days"].push({ label, value: Number(income_amount) });
      });

      // 2. Timeframe "Month": lọc những bản ghi thuộc tháng hiện tại
      sortedData.forEach(({ income_amount, created_at }) => {
        const date = new Date(created_at);
        if (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        ) {
          const label = `${date.getDate()}/${date.getMonth() + 1}`;
          groupedData.Month.push({ label, value: Number(income_amount) });
        }
      });
      groupedData.Month.reverse();

      // 3. Timeframe "Year": nhóm theo tháng (dạng tổng hợp) trong năm hiện tại
      sortedData.forEach(({ income_amount, created_at }) => {
        const date = new Date(created_at);
        if (date.getFullYear() === now.getFullYear()) {
          const monthLabel = date.toLocaleString("default", { month: "short" });
          groupedData.Year.set(
            monthLabel,
            (groupedData.Year.get(monthLabel) || 0) + Number(income_amount)
          );
        }
      });
      // Chuyển Map thành mảng rồi đảo ngược thứ tự (nếu cần)
      groupedData.Year = Array.from(groupedData.Year.entries())
        .map(([label, value]) => ({ label, value }))
        .reverse();

      // 4. Timeframe "Decade": nhóm theo năm trong 10 năm gần nhất (bao gồm năm hiện tại)
      sortedData.forEach(({ income_amount, created_at }) => {
        const date = new Date(created_at);
        const yearLabel = date.getFullYear();
        if (yearLabel >= now.getFullYear() - 9) {
          groupedData.Decade.set(
            yearLabel,
            (groupedData.Decade.get(yearLabel) || 0) + Number(income_amount)
          );
        }
      });
      groupedData.Decade = Array.from(groupedData.Decade.entries())
        .map(([label, value]) => ({ label, value }))
        .reverse();
    }

    return {
      "7-Days": groupedData["7-Days"],
      Month: groupedData.Month,
      Year: groupedData.Year,
      Decade: groupedData.Decade,
    };
  }, [chartData]);

  // Lấy nhãn và giá trị cho timeframe được chọn
  const timeframeData = parsedData[timeframe] || [];
  const labels = timeframeData.map((item) => item.label);
  const values = timeframeData.map((item) => item.value);

  return (
    <div className="incomechart-content-container">
      {/* Header */}
      <div className="portfolio-header">
        <div className="portfolio-header-title">
          <img
            src={piechartIcon}
            alt="Pie Chart Icon"
            className="portfolio-icon"
          />
          <span>Income Chart</span>
        </div>
        <hr className="portfolio-divider-fullwidth" />
      </div>

      {/* Bộ chọn Timeframe */}
      <div className="timeframe-selector">
        {["7-Days", "Month", "Year", "Decade"].map((tf) => (
          <label key={tf}>
            <input
              type="radio"
              value={tf}
              checked={timeframe === tf}
              onChange={(e) => setTimeframe(e.target.value)}
            />
            {tf}
          </label>
        ))}
      </div>

      {/* Container Chart */}
      <div className="chart-container">
        {labels.length > 0 ? (
          <Line
            data={{
              labels: labels,
              datasets: [
                {
                  data: values,
                  borderColor: "#4CAF50",
                  backgroundColor: "rgba(76, 175, 80, 0.2)",
                  borderWidth: 2,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 3,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
              },
              scales: {
                x: { grid: { display: false } },
                y: { grid: { color: "#e0e0e0" } },
              },
            }}
          />
        ) : (
          <p>No data</p>
        )}
      </div>
    </div>
  );
};

export default IncomeChart;
