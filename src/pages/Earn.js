import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Signal from "../components/Signal";
import Channel from "../components/Channel";
import Footer from "../components/Footer";
import Report from "../components/Report";
import BuyAC from "../components/BuyAC";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";
import "./KhoTang.css";
import "./Earn.css";
import { fetchMoreSignals, fetchMoreChannels } from "./api"; // Chỉ cần import các hàm tải thêm

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${hours}:${minutes} - ${day}/${month}`;
};

function Earn() {
  const [activeTab, setActiveTab] = useState("signal");
  const [activeCatalogue, setActiveCatalogue] = useState("All");
  const [autoCopyData, setAutoCopyData] = useState({});
  const [apikeyBot, setApikeyBot] = useState("");
  const [accountMT5, setAccountMT5] = useState("");
  const [groupId, setGroupID] = useState({});
  const [freeTradingList, setFreeTradingList] = useState([]);
  const [dataType, setDataType] = useState("Signals");
  const [signalData, setSignalData] = useState([]); // Dữ liệu cho Live Signals
  const [resultData, setResultData] = useState([]); // Dữ liệu cho Results
  const [channelData, setChannelData] = useState([]); // Dữ liệu cho Channels
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showBuyAC, setShowBuyAC] = useState(false);
  const [reportAuthor, setReportAuthor] = useState(null);
  const [reportChannelID, setReportChannelID] = useState(null);
  const [reportPrice, setReportPrice] = useState(null);
  const [reportWalletAC, setReportWalletAC] = useState(null);
  const [reportuserID, setReportuserID] = useState(null);
  const [reportactiveAccount, setReportActiveAccount] = useState(null);
  const [followingAuthors, setFollowingAuthors] = useState([]);
  const [signalPage, setSignalPage] = useState(1);
  const [resultPage, setResultPage] = useState(1);
  const [channelPage, setChannelPage] = useState(1);
  const [signalHasMore, setSignalHasMore] = useState(true);
  const [resultHasMore, setResultHasMore] = useState(true);
  const [channelHasMore, setChannelHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const [portId, setPortId] = useState(null);

  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);
  const observer = useRef();
  const lastScrollTop = useRef(0);

  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  // Xử lý cuộn toàn cục
  useEffect(() => {
    const handleWalletUpdate = () => {
      const updatedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
      setUserData(updatedUserData); // Cập nhật userData, bao gồm booking_channels
    };

    window.addEventListener("walletUpdated", handleWalletUpdate);
    return () => window.removeEventListener("walletUpdated", handleWalletUpdate);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      setIsFooterVisible(scrollTop <= lastScrollTop.current);
      lastScrollTop.current = scrollTop;

      if (scrollTop + clientHeight >= scrollHeight - 200 && !isFetching) {
        if (activeTab === "signal" && signalHasMore) {
          setSignalPage((prevPage) => prevPage + 1);
        } else if (activeTab === "results" && resultHasMore) {
          setResultPage((prevPage) => prevPage + 1);
        } else if (activeTab === "channel" && channelHasMore) {
          setChannelPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, activeTab, signalHasMore, resultHasMore, channelHasMore]);

  const handleReportClick = (author, price, channel_id) => {
    if (!userData) {
      console.error("userData chưa được tải!");
      return;
    }
    const activeAccount = userData?.trading_accounts?.find((account) => account.status === 1);
    setReportAuthor(author);
    setReportChannelID(channel_id);
    setReportPrice(price);
    setReportWalletAC(userData.wallet_AC);
    setReportuserID(userData.userID);
    setShowReport(true);
    if (activeAccount) {
      setReportActiveAccount(activeAccount.accountMT5);
    }
  };

  const handleItemClick = (Id, userId) => {
    navigate(`/${dataType}/${Id}`, { state: { userId } });
  };

  // Hàm tải dữ liệu bổ sung với cập nhật sessionStorage
  const fetchMoreData = async (page, type) => {
    if (isFetching || !userData || !userData.userID) return;
    setIsFetching(true);
  
    try {
      let newData;
      if (type === "signal") {
        newData = await fetchMoreSignals(apiKey, page, 10, "null");
      } else if (type === "results") {
        newData = await fetchMoreSignals(apiKey, page, 10, "not_null");
      } else if (type === "channel") {
        newData = await fetchMoreChannels(apiKey, page, 10);
      }
  
      const normalizedNewData = type === "channel"
        ? (newData.channelData || []).map(item => ({
            dataType: "Channels",
            author: item.author,
            avatar: item.avatar,
            description: item.description || "No description available.",
            wpr: item.wpr,
            totalSignals: item.totalSignals,
            totalResult: item.totalResult,
            price: item.price || 0,
            created_at: item.created_at || new Date().toISOString(),
            id: item.id, // Trường id của channel
          }))
        : (newData.signalData || []).map(item => ({
            ...item,
            done_at: item.done_at === "0000-00-00 00:00:00" ? null : item.done_at,
            id: item.id, // Trường id của signal
          }));
  
      const currentData = type === "signal" ? signalData : type === "results" ? resultData : channelData;
  
      // Lọc bỏ các dữ liệu trùng lặp dựa trên id của signal và id của channel
      const filteredNewData = normalizedNewData.filter(item => {
        return !currentData.some(existingItem => existingItem.id === item.id);
      });
  
      if (type === "signal") {
        setSignalData((prevData) => {
          const updatedData = [...prevData, ...filteredNewData].sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
          );
          sessionStorage.setItem("signalData", JSON.stringify(updatedData));
          return updatedData;
        });
        setSignalHasMore(newData.signalHasMore || filteredNewData.length === 10);
      } else if (type === "results") {
        setResultData((prevData) => {
          const updatedData = [...prevData, ...filteredNewData].sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
          );
          sessionStorage.setItem("resultData", JSON.stringify(updatedData));
          return updatedData;
        });
        setResultHasMore(newData.signalHasMore || filteredNewData.length === 10);
      } else if (type === "channel") {
        setChannelData((prevData) => {
          const updatedData = [...prevData, ...filteredNewData].sort((a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
          );
          sessionStorage.setItem("channelData", JSON.stringify(updatedData));
          return updatedData;
        });
        setChannelHasMore(newData.channelHasMore || filteredNewData.length === 10);
      }
    } catch (error) {
      console.error(`Lỗi khi tải thêm dữ liệu ${type}:`, error);
    } finally {
      setIsFetching(false);
    }
  };
  
  // Tải dữ liệu ban đầu từ sessionStorage hoặc API
  useEffect(() => {
    if (!userData || !userData.userID) return;

    setLoading(true);

    const cachedSignalData = sessionStorage.getItem("signalData");
    const cachedResultData = sessionStorage.getItem("resultData");
    const cachedChannelData = sessionStorage.getItem("channelData");

    const loadInitialData = async () => {
      if (cachedSignalData) {
        const normalizedSignalData = JSON.parse(cachedSignalData).map(item => ({
          ...item,
          done_at: item.done_at === "0000-00-00 00:00:00" ? null : item.done_at,
        })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setSignalData(normalizedSignalData);
      } else {
        await fetchMoreData(1, "signal");
      }

      if (cachedResultData) {
        const normalizedResultData = JSON.parse(cachedResultData).map(item => ({
          ...item,
          done_at: item.done_at === "0000-00-00 00:00:00" ? null : item.done_at,
        })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setResultData(normalizedResultData);
      } else {
        await fetchMoreData(1, "results");
      }

      if (cachedChannelData) {
        const normalizedChannelData = JSON.parse(cachedChannelData).map(item => ({
          dataType: "Channels",
          id: item.id,
          author: item.author,
          avatar: item.avatar,
          description: item.description || "No description available.",
          wpr: item.wpr,
          totalSignals: item.totalSignals,
          totalResult: item.totalResult,
          price: item.price || 0,
          created_at: item.created_at || new Date().toISOString(),
        })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setChannelData(normalizedChannelData);
      } else {
        await fetchMoreData(1, "channel");
      }

      setLoading(false);
    };

    loadInitialData();
  }, [userData]);

  // Tải dữ liệu bổ sung khi thay đổi trang
  useEffect(() => {
    if (signalPage > 1) fetchMoreData(signalPage, "signal");
  }, [signalPage]);

  useEffect(() => {
    if (resultPage > 1) fetchMoreData(resultPage, "results");
  }, [resultPage]);

  useEffect(() => {
    if (channelPage > 1) fetchMoreData(channelPage, "channel");
  }, [channelPage]);

  // Tải userData từ sessionStorage và lắng nghe cập nhật
  useEffect(() => {
    const cachedUserData = sessionStorage.getItem("userData");
    if (cachedUserData) {
      const userData = JSON.parse(cachedUserData);
      setUserData(userData);

      const activeAccount = userData.trading_accounts?.find((account) => account.status === 1);
      const followingAuthors = activeAccount?.following_channels?.map((channel) => channel.author) || [];

      const autoCopyMapping = {};
      if (activeAccount?.following_channels) {
        activeAccount.following_channels.forEach((channel) => {
          autoCopyMapping[channel.author] = channel.autoCopy ?? 0;
        });
      }

      const freeTradingSignals = activeAccount?.freetrading?.map((ft) => ft.signalID) || [];

      setFreeTradingList(freeTradingSignals);
      setFollowingAuthors(followingAuthors);
      setAutoCopyData(autoCopyMapping);
      setAccountMT5(activeAccount?.accountMT5 || "");
      setPortId(activeAccount?.port_id || null);
    }

    // Lắng nghe cập nhật userData từ sessionStorage
    const handleStorageUpdate = () => {
      const updatedUserData = JSON.parse(sessionStorage.getItem("userData"));
      if (updatedUserData) {
        setUserData(updatedUserData);

        const activeAccount = updatedUserData.trading_accounts?.find((account) => account.status === 1);
        const followingAuthors = activeAccount?.following_channels?.map((channel) => channel.author) || [];
        const autoCopyMapping = {};
        if (activeAccount?.following_channels) {
          activeAccount.following_channels.forEach((channel) => {
            autoCopyMapping[channel.author] = channel.autoCopy ?? 0;
          });
        }
        const freeTradingSignals = activeAccount?.freetrading?.map((ft) => ft.signalID) || [];

        setFreeTradingList(freeTradingSignals);
        setFollowingAuthors(followingAuthors);
        setAutoCopyData(autoCopyMapping);
        setAccountMT5(activeAccount?.accountMT5 || "");
        setPortId(activeAccount?.port_id || null);
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  useEffect(() => {
    window.updateFollowingAuthors = (author) => {
      setFollowingAuthors((prevAuthors) => [...prevAuthors, author]);
    };
  }, []);

  const handleUpdateFreeTrading = (signalID) => {
    setFreeTradingList((prevList) => [...prevList, signalID]);
  };

  const filteredData = (activeTab === "signal" ? signalData : activeTab === "results" ? resultData : channelData).filter((item) => {
    const isMatchingType = item.dataType === dataType;
    const isMatchingCatalogue = activeCatalogue === "All" || item.catalogues === activeCatalogue;

    if (activeTab === "results") {
      return isMatchingType && isMatchingCatalogue && item.done_at !== null;
    } else if (activeTab === "signal") {
      return isMatchingType && isMatchingCatalogue && item.done_at === null;
    }
    return isMatchingType && isMatchingCatalogue;
  });

  const handleTabClick = (tab, direction) => {
    setDirection(direction);
    setActiveTab(tab);
    setDataType(tab === "channel" ? "Channels" : "Signals");
  };

  const handleCatalogueClick = (catalogue) => {
    setActiveCatalogue(catalogue);
  };

  if (!userData) {
    return <ReloadSkeleton />;
  }

  return (
    <div className="App">
      <Header walletAC={userData.wallet_AC} userId={userData.userID} />
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="tab-menu">
          <button
            className={`btn_signal ${activeTab === "signal" ? "active" : ""}`}
            onClick={() => handleTabClick("signal", 1)}
          >
            Live signals
          </button>
          <button
            className={`btn_results ${activeTab === "results" ? "active" : ""}`}
            onClick={() => handleTabClick("results", -1)}
          >
            Results
          </button>
          <button
            className={`btn_channel ${activeTab === "channel" ? "active" : ""}`}
            onClick={() => handleTabClick("channel", 1)}
          >
            Channels
          </button>
        </div>

        <div className="filter-buttons-container">
          <div className="filter-buttons">
            <button
              className={`filter-button ${activeCatalogue === "All" ? "active" : ""}`}
              onClick={() => handleCatalogueClick("All")}
            >
              All
            </button>
            <button
              className={`filter-button ${activeCatalogue === "Crypto" ? "active" : ""}`}
              onClick={() => handleCatalogueClick("Crypto")}
            >
              Crypto
            </button>
            <button
              className={`filter-button ${activeCatalogue === "Forex" ? "active" : ""}`}
              onClick={() => handleCatalogueClick("Forex")}
            >
              Forex
            </button>
            <button
              className={`filter-button ${activeCatalogue === "Metal" ? "active" : ""}`}
              onClick={() => handleCatalogueClick("Metal")}
            >
              Metal
            </button>
            <button
              className={`filter-button ${activeCatalogue === "Stock" ? "active" : ""}`}
              onClick={() => handleCatalogueClick("Stock")}
            >
              Stock
            </button>
            <button
              className={`filter-button ${activeCatalogue === "Goods" ? "active" : ""}`}
              onClick={() => handleCatalogueClick("Goods")}
            >
              Goods
            </button>
            <button
              className={`filter-button ${activeCatalogue === "Index" ? "active" : ""}`}
              onClick={() => handleCatalogueClick("Index")}
            >
              Index
            </button>
          </div>
        </div>

        <div className="content-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            filteredData.map((item, index) => {
              const isLastElement = index === filteredData.length - 1;
              const isFollowing = followingAuthors.includes(item.author);
              const isBooked = userData.booking_channels?.some((channel) => channel.author === item.author) || false;
              const status = isBooked ? 1 : 0; // Trạng thái dựa trên booking_channels
              const autoCopy = autoCopyData[item.author] ?? 0;
              const freeTradingStatus = freeTradingList.includes(item.signalID) ? 1 : 0;
              if (item.dataType === "Signals") {
                return (
                  <Signal
                    id={item.id}
                    key={item.signalID || `signal-${index}`}
                    avatar={item.avatar}
                    TP1={item.tpSigPrice1}
                    TP2={item.tpSigPrice2}
                    TP3={item.tpSigPrice3}
                    E1={item.eSigPrice}
                    SL={item.slSigPrice1}
                    margin={item.symbol}
                    command={item.isBuy}
                    result={item.R_result}
                    accountMT5={accountMT5}
                    freetrading={freeTradingStatus}
                    author={item.author}
                    signalID={item.signalID}
                    userID={userData.userID}
                    status={status} // Cập nhật status dựa trên booking
                    autoCopy={autoCopy}
                    port_id={portId}
                    R_result={item.R_result}
                    created_at={formatDate(item.created_at)}
                    done_at={item.done_at ? formatDate(item.done_at) : null}
                    onUpdateFreeTrading={handleUpdateFreeTrading}
                  />
                );
              } else if (item.dataType === "Channels") {
                return (
                  <Channel
                    key={item.author || `channel-${index}`}
                    channel_id={item.id}
                    author={item.author}
                    avatar={item.avatar}
                    description={item.description}
                    profitRank={item.wpr}
                    totalSignals={item.totalSignals}
                    totalR={item.totalResult}
                    status={status} 
                    price={item.price}
                    onReportClick={status === 0 ? () => handleReportClick(item.author, item.price, item.id) : undefined}
                    updateFollowingAuthors={window.updateFollowingAuthors}
                  />
                );
              }
              return null;
            })
          )}
          {isFetching && (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  border: "4px solid #f3f3f3",
                  borderTop: "4px solid #3498db",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
            </div>
          )}
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>

        {showReport && !showBuyAC && (
          <div className="report-modal">
            <Report
              author={reportAuthor}
              channel_id={reportChannelID}
              price={reportPrice}
              walletAC={reportWalletAC}
              userID={reportuserID}
              activeAccount={reportactiveAccount}
              onClose={() => setShowReport(false)}
              onBuyAC={() => {
                setShowReport(false);
                setShowBuyAC(true);
              }}
            />
          </div>
        )}

        {showBuyAC && (
          <div className="report-modal">
            <BuyAC userID={reportuserID} walletAC={reportWalletAC} onClose={() => setShowBuyAC(false)} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Earn;