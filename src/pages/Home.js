import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import QuizCard from "../components/QuizCard";
import News from "../components/News";
import Channel from "../components/Channel";
import Footer from "../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "./Home.css";
import avatar from "../components/assets/avatar.gif";
import Loading from "../components/loading";
import { preloadData } from "./api";
import { sendTelegramMessage } from "../components/TelegramNotification";

const announData = [
  "Welcome to Finance World!",
  "Đừng bỏ lỡ cơ hội nhận giải thưởng lớn!",
  "Khám phá ngay các item hấp dẫn!",
  "Tìm hiểu thêm về các chương trình ưu đãi!",
  "Heleng Nguyen đóng góp 1500 TBC cho Quỹ khuyến học TadaBee - 2 tiếng trước",
];

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${hours}:${minutes} - ${day}/${month}`;
};

function Home() {
  const [activeTab, setActiveTab] = useState(1);
  const [announText, setAnnounText] = useState(announData[0]);
  const [currentAnnounIndex, setCurrentAnnounIndex] = useState(0);
  const [newsData, setNewsData] = useState([]); // Dữ liệu cho Tin tức
  const [tadaTVData, setTadaTVData] = useState([]); // Dữ liệu cho TadaTV
  const [channelData, setChannelData] = useState([]);
  const [signalData, setSignalData] = useState([]);
  const [resultData, setResultData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [charityData, setCharityData] = useState([]);
  const [giftData, setGiftData] = useState([]);
  const [walletAC, setWalletAC] = useState(0);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [telegramId, setTelegramId] = useState(null);
  const [followingAuthors, setFollowingAuthors] = useState([]);
  const [error, setError] = useState(null); // Thêm state để hiển thị lỗi

  const location = useLocation();
  const navigate = useNavigate();
  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  // Lấy ID từ URL hoặc gán mặc định
  useEffect(() => {
    const checkTelegramData = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        const telegramData = window.Telegram.WebApp.initDataUnsafe?.user;
        const id = 35076483;
        if (telegramData) {
          const telegramId = telegramData.id;
          setTelegramId(telegramId || id);
        } else {
          setTelegramId(id);
        }
      } else {
        const queryParams = new URLSearchParams(window.location.search);
        const telegramIdFromUrl = queryParams.get("telegramId");
        setTelegramId(telegramIdFromUrl || id);
      }
    };
    checkTelegramData();
  }, []);

  // Lấy dữ liệu từ API và lắng nghe cập nhật sessionStorage
  useEffect(() => {
    if (!telegramId) return;

    const fetchData = async () => {
      // Kiểm tra dữ liệu trong sessionStorage
      const cachedNewsData = sessionStorage.getItem("newsData");
      const cachedTadaTVData = sessionStorage.getItem("tadaTVData");
      const cachedChannelData = sessionStorage.getItem("channelData");
      const cachedQuizData = sessionStorage.getItem("quizData");
      const cachedCourseData = sessionStorage.getItem("courseData");
      const cachedCharityData = sessionStorage.getItem("charityData");
      const cachedGiftData = sessionStorage.getItem("giftData");
      const cachedUserData = sessionStorage.getItem("userData");
      const cachedSignalData = sessionStorage.getItem("signalData");
      const cachedResultData = sessionStorage.getItem("resultData");

      if (
        cachedNewsData &&
        cachedTadaTVData &&
        cachedChannelData &&
        cachedQuizData &&
        cachedCourseData &&
        cachedCharityData &&
        cachedGiftData &&
        cachedSignalData &&
        cachedResultData &&
        cachedUserData
      ) {
        setNewsData(JSON.parse(cachedNewsData));
        setTadaTVData(JSON.parse(cachedTadaTVData));
        setChannelData(JSON.parse(cachedChannelData));
        setSignalData(JSON.parse(cachedSignalData));
        setResultData(JSON.parse(cachedResultData));
        setQuizData(JSON.parse(cachedQuizData));
        setCourseData(JSON.parse(cachedCourseData));
        setUserData(JSON.parse(cachedUserData));
        setCharityData(JSON.parse(cachedCharityData));
        setGiftData(JSON.parse(cachedGiftData));
        setIsLoading(false);
      } else {
        try {
          // Chỉ gọi preloadData một lần duy nhất
          const preload = await preloadData(apiKey, telegramId, 1, 10);

          // Lọc dữ liệu từ preload để gán vào các state tương ứng
          setNewsData(preload.newsData.filter(item => item.dataType === "Tin tức"));
          setTadaTVData(preload.newsData.filter(item => item.dataType === "TadaTV"));
          setChannelData(preload.channelData);
          setSignalData(preload.signalData); // Live Signals (done_at = null)
          setResultData(preload.resultData); // Results (done_at != null)
          setQuizData(preload.quizData);
          setCourseData(preload.courseData);
          setCharityData(preload.charityData);
          setGiftData(preload.giftData);
          setUserData(preload.userData);

          // Lưu vào sessionStorage
          sessionStorage.setItem("newsData", JSON.stringify(preload.newsData.filter(item => item.dataType === "Tin tức")));
          sessionStorage.setItem("tadaTVData", JSON.stringify(preload.newsData.filter(item => item.dataType === "TadaTV")));
          sessionStorage.setItem("channelData", JSON.stringify(preload.channelData));
          sessionStorage.setItem("signalData", JSON.stringify(preload.signalData));
          sessionStorage.setItem("resultData", JSON.stringify(preload.resultData));
          sessionStorage.setItem("quizData", JSON.stringify(preload.quizData));
          sessionStorage.setItem("courseData", JSON.stringify(preload.courseData));
          sessionStorage.setItem("userData", JSON.stringify(preload.userData));
          sessionStorage.setItem("charityData", JSON.stringify(preload.charityData));
          sessionStorage.setItem("giftData", JSON.stringify(preload.giftData));
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Lắng nghe cập nhật userData từ sessionStorage
    const handleStorageUpdate = () => {
      const updatedUserData = JSON.parse(sessionStorage.getItem("userData"));
      if (updatedUserData) {
        setUserData(updatedUserData);
        const activeAccount = updatedUserData.trading_accounts?.find(account => account.status === 1);
        const followingAuthors = activeAccount?.following_channels?.map(channel => channel.author) || [];
        setFollowingAuthors(followingAuthors);
        setWalletAC(updatedUserData.wallet_AC || 0);
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, [telegramId, apiKey]);

  // Lấy danh sách followingAuthors từ activeAccount
  useEffect(() => {
    if (userData) {
      const activeAccount = userData.trading_accounts?.find(account => account.status === 1);
      const followingAuthors = activeAccount?.following_channels?.map(channel => channel.author) || [];
      setFollowingAuthors(followingAuthors);
      setWalletAC(userData.wallet_AC || 0);
    }
  }, [userData]);

  // Cập nhật walletAC từ sessionStorage khi Home load
  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
    setUserData(storedUserData);
  }, []);

  useEffect(() => {
    window.updateFollowingAuthors = (author) => {
      setFollowingAuthors((prevAuthors) => [...prevAuthors, author]);
    };
  }, []);

  const newsStatusMap = useMemo(
    () => new Map(userData?.news_reads?.map((read) => [read.news_id, true])),
    [userData]
  );

  const handleItemClick = (newsId) => {
    navigate(`/Tin tức/${newsId}`, { state: { userId: userData?.userID } });
  };

  const handleReportClick = (author, price) => {
    // Chưa có xử lý cụ thể trong file gốc, giữ nguyên để tương thích
    console.log(`Report clicked for ${author} with price ${price}`);
  };

  return (
    <div className="home">
      {isLoading && <Loading />}
      {error && <div className="error-message">{error}</div>}
      {!isLoading && !error && (
        <>
          <Header userId={userData?.userID} />
          <div className="rectangle-container">
            <div className="home-circle">
              <img src={avatar} alt="Gift Icon" />
            </div>
            <div className="rectangle">
              <div className="rectangle-text">{announText}</div>
            </div>
          </div>
          <main className="content-wrapper">
            <h2 className="title">Featured Channels</h2>
            {channelData.length === 0 ? (
              <Loading />
            ) : (
              <Swiper
                spaceBetween={20}
                slidesPerView={1}
                pagination={{ clickable: true, dynamicBullets: true }}
              >
                {channelData.map((item) => {
                  const isBooked = userData.booking_channels?.some((channel) => channel.author === item.author) || false;
                  const status = isBooked ? 1 : 0; // Trạng thái dựa trên booking_channels
                  return (
                    <SwiperSlide key={item.author || item.id}>
                      <Channel
                        author={item.author}
                        avatar={item.avatar}
                        description={item.description}
                        profitRank={item.wpr}
                        totalSignals={item.totalSignals}
                        totalPips={item.totalResult}
                        status={status} // Cập nhật status dựa trên booking
                        price={item.price}
                        onReportClick={status === 0 ? () => handleReportClick(item.author, item.price) : undefined}
                        updateFollowingAuthors={window.updateFollowingAuthors}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            )}
            <div className="dynamic-content">
              <h2 className="title">Latest News</h2>
            </div>
            {newsData.length === 0 ? (
              <Loading />
            ) : (
              <div>
                {newsData
                  .filter((item) => item.dataType === "Tin tức")
                  .map((item) => (
                    <div key={item.id} onClick={() => handleItemClick(item.id)}>
                      <News
                        title={item.title}
                        description={item.description}
                        banner={item.banner}
                        heartValue={item.heart}
                        commentValue={item.comment}
                        ac={item.ac}
                        author={item.author}
                        created_at={formatDate(item.created_at)}
                        status={newsStatusMap.has(item.id) ? 0 : 1}
                      />
                    </div>
                  ))}
              </div>
            )}
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default Home;