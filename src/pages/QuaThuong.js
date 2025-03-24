import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Charity from "../components/Charity";
import Gift from "../components/Gift";
import Report from "../components/Report-Challenge";
import Footer from "../components/Footer";
import "./QuaThuong.css";
import { preloadData } from "./api"; // Import từ file API

function QuaThuong() {
  const [activeTab, setActiveTab] = useState("doithuong"); // Tab mặc định
  const [charityData, setCharityData] = useState([]); // Dữ liệu Quyên góp
  const [giftData, setGiftData] = useState([]); // Dữ liệu Đổi thưởng
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReport, setShowReport] = useState(true);
  const navigate = useNavigate();

  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  // Lấy dữ liệu từ sessionStorage hoặc preload
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const cachedUserData = sessionStorage.getItem("userData");
      const cachedCharityData = sessionStorage.getItem("charityData");
      const cachedGiftData = sessionStorage.getItem("giftData");

      if (cachedUserData && cachedCharityData && cachedGiftData) {
        setUserData(JSON.parse(cachedUserData));
        setCharityData(JSON.parse(cachedCharityData));
        setGiftData(JSON.parse(cachedGiftData));
      } else {
        try {
          const preload = await preloadData(apiKey, 9999); // Gán userId mặc định nếu cần
          setUserData(preload.userData);
          setCharityData(preload.charityData);
          setGiftData(preload.giftData);

          // Lưu vào sessionStorage
          sessionStorage.setItem("userData", JSON.stringify(preload.userData));
          sessionStorage.setItem("charityData", JSON.stringify(preload.charityData));
          sessionStorage.setItem("giftData", JSON.stringify(preload.giftData));
        } catch (error) {
          console.error("Error during preload:", error);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [apiKey]);

  // Lọc dữ liệu dựa trên tab
  const filteredData = useMemo(() => {
    if (activeTab === "tuthien") return charityData;
    if (activeTab === "doithuong") return giftData;
    return [];
  }, [activeTab, charityData, giftData]);

  // Xử lý chuyển tab
  const handleTabClick = (tab) => setActiveTab(tab);

  // Điều hướng đến trang chi tiết
  const handleNavigate = (id, dataType) => {
    navigate(`/QuaThuongDetail/${id}?dataType=${dataType}`);
  };

  if (!userData || loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="App">
      <Header walletAC={userData.wallet_AC} userId={userData.userID} />
      <main>
        {/* Nút chuyển đổi tab */}
        <div className="tab-menu">
          <button
            className={`btn_doithuong ${activeTab === "doithuong" ? "active" : ""}`}
            onClick={() => handleTabClick("doithuong")}
          >
            Gifts
          </button>
          <button
            className={`btn_tuthien ${activeTab === "tuthien" ? "active" : ""}`}
            onClick={() => handleTabClick("tuthien")}
          >
            Charity
          </button>
        </div>

         {/* Nếu đang ở tab "tuthien", hiển thị báo cáo Coming Soon */}
         {activeTab === "tuthien" && (
           <div className="report-modal">
           <Report
             onClose={() => setShowReport(false)}
           />
         </div>
        )}

        {/* Hiển thị dữ liệu */}
        <div className="content-container">
          {filteredData.map((item) => {
            if (activeTab === "tuthien") {
              return (
                <div key={item.id} onClick={() => handleNavigate(item.id, item.dataType)}>
                  <Charity
                    title={item.title}
                    description={item.description}
                    banner={item.banner}
                    charity_target={item.charity_target}
                    charity_status={item.charity_status}
                    charity_title={item.charity_title}
                    top_contributors={item.top_contributors}
                    members={item.total_contributors}
                    status={1}
                    gift_title={item.gift_title}
                    dataType={item.dataType}
                  />
                </div>
              );
            } else if (activeTab === "doithuong") {
              return (
                <div key={item.id} onClick={() => handleNavigate(item.id, item.dataType)}>
                  <Gift
                    title={item.title}
                    description={item.description}
                    banner={item.banner}
                    giftValue={item.giftValue}
                    gift_title={item.gift_title}
                    gift_info={item.gift_info}
                    gift_link={item.gift_link}
                    remaining_gifts={item.remaining_gifts}
                    backgroundColor={item.backgroundColor}
                  />
                </div>
              );
            } else {
              return null;
            }
            
          })
          
          }
          
        </div>
        
      </main>
      <Footer />
    </div>
  );
}

export default QuaThuong;
