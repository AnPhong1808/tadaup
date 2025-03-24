import React, { useState, useEffect } from "react";
import { ReloadSkeleton, PreloadImage } from "../components/waiting"; // Import Skeleton từ file chờ
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

const SignalChart = ({ id }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMinute, setCurrentMinute] = useState(null); // Trạng thái hiện tại của phút (1m, 2m, ...)
  const [intervalId, setIntervalId] = useState(null); // Để lưu lại ID của setInterval

  // Gọi API để lấy dữ liệu từ 1m đến 15m
  const fetchData = async (minute = null) => {
    try {
      const url = minute
        ? `https://admin.tducoin.com/api/signal/result/${id}?value=${minute}`
        : `https://admin.tducoin.com/api/signal/result/${id}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      // Chuyển đổi đối tượng thành mảng { timeframe, value }
      const transformedData = Object.keys(data).map((key) => ({
        timeframe: key,
        value: data[key],
      }));

      if (!minute) {
        // Nếu lần đầu tiên, lấy toàn bộ dữ liệu từ 1m đến 15m
        setChartData(transformedData);
        const lastMinute = transformedData.find((item) => item.timeframe === "15m");
        if (lastMinute) {
          setCurrentMinute("15m"); // Đặt trạng thái ở 15m nếu dữ liệu có 15m
        } else {
          setCurrentMinute(transformedData[0]?.timeframe); // Nếu không có 15m, bắt đầu từ phút đầu tiên
        }
      } else {
        // Nếu có dữ liệu mới, thêm dữ liệu vào chartData
        setChartData((prevData) => [...prevData, ...transformedData]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Gọi dữ liệu lần đầu tiên
    fetchData();

    // Cập nhật API mỗi phút nếu chưa đến 15m
    const interval = setInterval(() => {
      if (currentMinute && currentMinute !== "15m") {
        const nextMinute = getNextMinute(currentMinute);
        if (nextMinute) {
          setCurrentMinute(nextMinute);
          fetchData(nextMinute);
        }
      }
    }, 60000); // Gọi API mỗi 1 phút

    setIntervalId(interval);

    // Dọn dẹp khi component bị unmount
    return () => {
      clearInterval(interval);
    };
  }, [currentMinute, id]);

  const getNextMinute = (minute) => {
    const minutes = ["1m", "2m", "3m", "4m", "5m", "6m", "7m", "8m", "9m", "10m", "11m", "12m", "13m", "14m", "15m"];
    const currentIndex = minutes.indexOf(minute);
    return currentIndex < minutes.length - 1 ? minutes[currentIndex + 1] : "15m";
  };

  // Đảo ngược mảng dữ liệu để 15m ở đầu và 1m ở cuối
  const reversedChartData = [...chartData].reverse();

  // Chuẩn bị dữ liệu cho biểu đồ
  const labels = reversedChartData.map((item) => item.timeframe); // Giả sử mỗi item có trường timeframe
  const values = reversedChartData.map((item) => item.value); // Giả sử mỗi item có trường value

  return (
    <div className="incomechart-content-container">
      {/* Header */}
      <div className="portfolio-header">
        <div className="portfolio-header-title">
          <span>Signal Result Chart</span>
        </div>
        <hr className="portfolio-divider-fullwidth" />
      </div>

      {/* Container Chart */}
      <div className="chart-container">
        {loading ? (
          <ReloadSkeleton /> // Sử dụng Skeleton thay vì Loading
        ) : labels.length > 0 ? (
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
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default SignalChart;
