import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Signal from "../components/Signal-Detail";
import SignalChart from "../components/Signal-Chart";
import Strategy from "../components/Controller-Signal";
import Footer from "../components/Footer";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${hours}:${minutes} - ${day}/${month}`;
};

function SignalDetail() {
  const { id } = useParams(); // Lấy id từ URL
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [controllerData, setControllerData] = useState(null);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const autoCopy = parseInt(queryParams.get("autoCopy")) || 0;

  // Tải dữ liệu signal từ sessionStorage
  useEffect(() => {
    const cachedSignalData = sessionStorage.getItem("signalData");
    if (cachedSignalData) {
      const signalData = JSON.parse(cachedSignalData);
      const foundSignal = signalData.find((item) => item.id === parseInt(id));
      if (foundSignal) {
        setSignal(foundSignal);
      }
      setLoading(false);
    }
  }, [id]);

  // Tải userData từ sessionStorage
  useEffect(() => {
    const cachedUserData = sessionStorage.getItem("userData");
    if (cachedUserData) {
      const userData = JSON.parse(cachedUserData);
      setUserData(userData);
    }
  }, []);

  // Gọi API signalcontroller khi có userData và signal
  useEffect(() => {
    if (!userData || !signal) return;

    const activeAccount = userData.trading_accounts.find(
      (account) => account.status === 1
    );

    let isMounted = true; // Flag để kiểm tra component còn mount không

    const fetchControllerData = async () => {
      // Kiểm tra controllerData trong sessionStorage
      const cachedControllerData = sessionStorage.getItem("controllerData");
      let controllerDataArray = cachedControllerData ? JSON.parse(cachedControllerData) : [];

      // Nếu không phải mảng thì khởi tạo lại
      if (!Array.isArray(controllerDataArray)) {
        controllerDataArray = [];
      }

      // Tìm dữ liệu theo signal_id
      const existingData = controllerDataArray.find(
        (item) => item.signal_id === signal.signalID
      );

      if (existingData) {
        // Nếu đã có dữ liệu trong sessionStorage, sử dụng nó
        if (isMounted) {
          setControllerData(existingData);
        }
        return;
      }

      try {
        const response = await fetch(
          `https://admin.tducoin.com/api/signal/signalcontroller?signal_id=${signal.signalID}&accountMT5=${activeAccount?.accountMT5 || ""}&userID=${userData.userID}`,
          {
            method: "GET",
            headers: {
              "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch controller data");
        }

        const data = await response.json();
        if (isMounted) {
          setControllerData(data);
          // Lưu vào sessionStorage
          controllerDataArray.push(data);
          sessionStorage.setItem("controllerData", JSON.stringify(controllerDataArray));
        }
      } catch (error) {
        console.error("Error fetching controller data:", error);
        if (isMounted) {
          setControllerData(null); // Hoặc xử lý lỗi theo cách khác nếu cần
        }
      }
    };

    fetchControllerData();

    // Cleanup function
    return () => {
      isMounted = false; // Đánh dấu component đã unmount
    };
  }, [signal, userData]);

  // Hàm xử lý cập nhật controllerData từ Strategy
  const handleUserDataUpdate = (updatedControllerData) => {
    setControllerData(updatedControllerData); // Cập nhật controllerData từ POST API
    // Cập nhật sessionStorage
    const cachedControllerData = sessionStorage.getItem("controllerData");
    let controllerDataArray = cachedControllerData ? JSON.parse(cachedControllerData) : [];
    
    if (!Array.isArray(controllerDataArray)) {
      controllerDataArray = [];
    }

    const index = controllerDataArray.findIndex(
      (item) => item.signal_id === updatedControllerData.signal_id
    );

    if (index !== -1) {
      controllerDataArray[index] = updatedControllerData; // Cập nhật dữ liệu cũ
    } else {
      controllerDataArray.push(updatedControllerData); // Thêm mới nếu chưa có
    }

    sessionStorage.setItem("controllerData", JSON.stringify(controllerDataArray));
  };

  if (!userData || loading) {
    return <div>Loading...</div>;
  }

  if (!signal) {
    return <div>Signal not found</div>;
  }

  // Lấy activeAccount (tài khoản có status = 1)
  const activeAccount = userData.trading_accounts.find(
    (account) => account.status === 1
  );

  return (
    <div className="App">
      <Header walletAC={userData.wallet_AC} userId={userData.userID} />
      <main style={{ minHeight: "calc(100vh - 60px)" }}>
        <div className="content-container">
          <SignalChart 
            id={signal.signalID || 0}
          />
          <Signal
            id={signal.id}
            key={signal.signalID}
            avatar={signal.avatar}
            TP1={signal.tpSigPrice1}
            TP2={signal.tpSigPrice2}
            TP3={signal.tpSigPrice3}
            E1={signal.eSigPrice}
            SL={signal.slSigPrice1}
            margin={signal.symbol}
            command={signal.isBuy}
            result={signal.R_result}
            apikeyBot={userData.trading_accounts[0]?.apikeyBot || ""}
            accountMT5={userData.trading_accounts[0]?.accountMT5 || ""}
            freetrading={0} // Giả sử không có freetrading
            groupId={userData.trading_accounts[0]?.telegramgroup_id || 0}
            author={signal.author}
            signalID={signal.signalID}
            userID={userData.userID}
            status={1}
            autoCopy={autoCopy}
            R_result={signal.R_result}
            created_at={formatDate(signal.created_at)}
            done_at={signal.done_at ? formatDate(signal.done_at) : null}
          />
          <Strategy
            accountMT5={controllerData?.accountMT5 || activeAccount?.accountMT5 || ""}
            userID={controllerData?.userID || userData.userID}
            signal_id={signal.signalID || 0}
            isEntry={controllerData?.isEntry ?? 0} // Mặc định 0 nếu chưa có dữ liệu
            entryType={controllerData?.entryType ?? 0} // Mặc định 0 nếu chưa có dữ liệu
            capitalManagement={controllerData?.capitalManagement ?? 0} // Mặc định 0 nếu chưa có dữ liệu
            SLUSD={controllerData?.SLUSD ?? 0} // Mặc định 0 nếu chưa có dữ liệu
            onUserDataUpdate={handleUserDataUpdate}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SignalDetail;