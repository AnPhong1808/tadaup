import React, { useEffect, useState } from "react";

import Header from "../components/Header";
import IncomeChart from "../components/Income-Chart";
import Balance from "../components/Balance";
import TradingAnalysis from "../components/Trading-Analysis";
import Strategy from "../components/Controller-Strategy";
import ControllerMore from "../components/Controller-More";
import ControllerAccount from "../components/Controller-Account";
import DemoAccount from "../components/Demo-Account"; // Thêm import component DemoAccount
import BotAdd from "../components/Bot-Add";
import Footer from "../components/Footer";
import Report from "../components/Report-Bot";
import BuyAC from "../components/BuyAC";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";
import "./KhoTang.css";

function FundBot() {
  const [activeTab, setActiveTab] = useState("portfolio"); // Tab hiện tại
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [showDemoAccount, setShowDemoAccount] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showBuyAC, setShowBuyAC] = useState(false);

  const [direction, setDirection] = useState(1); // Hướng trượt

  useEffect(() => {
    const cachedUserData = sessionStorage.getItem("userData");

    if (cachedUserData) {
      const parsedData = JSON.parse(cachedUserData);
      if (!parsedData.trading_accounts) {
        parsedData.trading_accounts = [];
      }
      setUserData(parsedData);
    } else {
      console.error("No user data found in sessionStorage!");
      setUserData({ trading_accounts: [] });
    }

    setLoading(false);
  }, []);

  const handleUserDataUpdate = (updatedAccounts) => {
    setUserData((prevData) => {
      if (!prevData || !Array.isArray(prevData.trading_accounts)) return prevData;
      const newUserData = {
        ...prevData,
        trading_accounts: Array.isArray(updatedAccounts) ? updatedAccounts : [],
      };
      sessionStorage.setItem("userData", JSON.stringify(newUserData));
      return newUserData;
    });
  };

  const updateUserData = (newData) => {
    setUserData((prevData) => {
      const updatedData = { ...prevData, ...newData };
      sessionStorage.setItem("userData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleTabClick = (tab) => {
    setDirection(tab === "portfolio" ? 1 : -1);
    setActiveTab(tab);
  };

  const activeAccount = userData?.trading_accounts?.find(
    (account) => account.status === 1
  );

  if (!userData) {
    return <ReloadSkeleton />;
  }

  return (
    <div className="App">
      <Header walletAC={userData.wallet_AC} userId={userData.userID} />
      <main>
        {userData.trading_accounts.length === 0 && showDemoAccount &&  (
          <div className="report-modal">
          <DemoAccount userID={userData.userID} onClose={() => {
              setShowDemoAccount(false);
              updateUserData(JSON.parse(sessionStorage.getItem("userData")));
            }} />
          </div>
        )}
        <div className="tab-menu">
          <button
            className={`btn_portfolio ${activeTab === "portfolio" ? "active" : ""}`}
            onClick={() => handleTabClick("portfolio")}
          >
            Portfolio
          </button>
          <button
            className={`btn_controller ${activeTab === "controller" ? "active" : ""}`}
            onClick={() => handleTabClick("controller")}
          >
            Controller
          </button>
          <button
            className={`btn_account ${activeTab === "account" ? "active" : ""}`}
            onClick={() => handleTabClick("account")}
          >
            Account
          </button>
        </div>

        <div className="content-container">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  {activeTab === "portfolio" && (
                    <div>
                      <IncomeChart 
                        trading_accounts={userData.trading_accounts}
                        accountMT5={activeAccount?.accountMT5 || ""}
                      />
                      <Balance 
                        trading_accounts={userData.trading_accounts}
                        accountMT5={activeAccount?.accountMT5 || ""} 
                      />
                      <TradingAnalysis 
                        trading_accounts={userData.trading_accounts}
                        accountMT5={activeAccount?.accountMT5 || ""} 
                      />
                    </div>
                  )}
                  {activeTab === "controller" && (
                    <div>
                      <Strategy
                        userID={userData.userID}
                        accountMT5={activeAccount?.accountMT5 || ""}
                        port_id={activeAccount?.port_id || ""}
                        trading_accounts={userData.trading_accounts}
                        onUserDataUpdate={handleUserDataUpdate}
                      />
                      <ControllerMore
                        userID={userData.userID}
                        accountMT5={activeAccount?.accountMT5 || ""}
                        port_id={activeAccount?.port_id || ""}
                        onUserDataUpdate={handleUserDataUpdate}
                      />
                    </div>
                  )}
                  {activeTab === "account" && (
                    <div>
                      {userData.trading_accounts.length > 0 ? (
                        userData.trading_accounts
                        .filter(account => account.IP !== null && account.IP !== undefined) // Lọc những tài khoản có apikeyBot khác null hoặc undefined
                        .map((account, index) => (
                          <ControllerAccount
                            key={index}
                            index={index}
                            userID={userData.userID}
                            accountMT5={account.accountMT5}
                            trading_accounts={userData.trading_accounts}
                            onUserDataUpdate={handleUserDataUpdate}
                          />
                      ))
                      ) : (
                        <p>Don't found any legal account.</p>
                      )}

                      <BotAdd onClick={() => setShowReport(true)} />
                    </div>
                  )}
                </>
              )}
        </div>
        {showReport && !showBuyAC && (
          <div className="report-modal">
            <Report
              userID={userData.userID}
              price={500}
              walletAC={userData.wallet_AC}
              onClose={() => setShowReport(false)}
              onBuyAC={() => {
                setShowReport(false); // Ẩn Report
                setShowBuyAC(true);   // Hiển thị BuyAC
              }}
              />
          </div>
        )}
        {showBuyAC && (
          <div className="report-modal">
          <BuyAC
            userID={userData.userID}
            walletAC={userData.wallet_AC}
            onClose={() => setShowBuyAC(false)}
          />
        </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default FundBot;
