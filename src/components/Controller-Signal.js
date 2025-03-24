import React, { useState, useRef, useEffect } from "react";
import "./Signal.css";
import "./Controller-Strategy.css";
import botsettingIcon from "./assets/icons/bot-setting.png";
import upIcon from "./assets/icons/up.png";
import downIcon from "./assets/icons/down.png";
import TelegramNotification, { sendTadaServer1Message } from './TelegramNotification';

const ControllerSignal = ({ signal_id, accountMT5, userID, isEntry, capitalManagement, SLUSD, onUserDataUpdate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEntryOn, setIsEntryOn] = useState(false);
  const [isStrategyManagementOn, setIsStrategyManagementOn] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [numericValue, setNumericValue] = useState("");
  const [channelsDropdownOpen, setChannelsDropdownOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [authorDropdowns, setAuthorDropdowns] = useState({});
  const [selectedAuthorStrategies, setSelectedAuthorStrategies] = useState({});

  const dropdownRef = useRef(null);
  const channelsDropdownRef = useRef(null);
  const authorDropdownRefs = useRef({});

  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [channelsDropdownHeight, setChannelsDropdownHeight] = useState(0);
  const [authorDropdownHeights, setAuthorDropdownHeights] = useState({});

  // Dữ liệu từ sessionStorage
  const cachedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
  const trading_accounts = cachedUserData.trading_accounts || [];
  const currentAccount = trading_accounts.find(
    (account) => account.accountMT5 === accountMT5
  );
  const followingChannels = currentAccount?.following_channels || [];
  const port_id = currentAccount?.port_id || 0;

  // Khởi tạo state ban đầu từ props chỉ khi component mount lần đầu
  useEffect(() => {
    if (capitalManagement !== undefined && capitalManagement !== null) {
      setIsStrategyManagementOn(capitalManagement >= 0);
      setSelectedStrategy(capitalManagement >= 0 ? strategyOptions[capitalManagement] : "");
    }
    if (SLUSD !== undefined && SLUSD !== null) {
      setNumericValue(SLUSD.toString());
    }
    if (isEntry !== undefined && isEntry !== null) {
      setIsEntryOn(isEntry === 1); // Khởi tạo dựa trên isEntry từ props
    }
    const initialChannels = followingChannels
      .filter((channel) => channel.autoCopy === 1)
      .map((channel) => channel.author);
    setSelectedChannels(initialChannels);

    const initialDropdowns = {};
    const initialStrategies = {};
    followingChannels.forEach(channel => {
      if (channel.autoCopy === 1) {
        initialDropdowns[channel.author] = false;
        initialStrategies[channel.author] = channel.capitalManagement >= 0 ? strategyOptions[channel.capitalManagement] : "";
      }
    });
    setAuthorDropdowns(initialDropdowns);
    setSelectedAuthorStrategies(initialStrategies);
  }, [capitalManagement, SLUSD, isEntry]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleChannelsDropdown = () => {
    setChannelsDropdownOpen((prev) => !prev);
  };

  const toggleAuthorDropdown = (author) => {
    setAuthorDropdowns(prev => ({
      ...prev,
      [author]: !prev[author]
    }));
  };

  useEffect(() => {
    if (isDropdownOpen && dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.scrollHeight);
    } else {
      setDropdownHeight(0);
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    if (channelsDropdownOpen && channelsDropdownRef.current) {
      setChannelsDropdownHeight(channelsDropdownRef.current.scrollHeight);
    } else {
      setChannelsDropdownHeight(0);
    }
  }, [channelsDropdownOpen]);

  useEffect(() => {
    const newHeights = {};
    Object.keys(authorDropdowns).forEach(author => {
      if (authorDropdowns[author] && authorDropdownRefs.current[author]) {
        newHeights[author] = authorDropdownRefs.current[author].scrollHeight;
      } else {
        newHeights[author] = 0;
      }
    });
    setAuthorDropdownHeights(newHeights);
  }, [authorDropdowns]);

  const strategyOptions = [
    "Risk 1 : Reward 2 - Profit 1% - Lost 12 Orders",
    "Risk 1 : Reward 3 - Profit 1% - Lost 15 Orders",
    "Risk 1 : Reward 20 - Profit 6% - Lost 50 Orders",
    "Risk 1 : Reward 6 - Profit 10% - Lost 15 Orders",
    "Risk 1 : Reward 1 - Profit 3% - Lost 5 Orders",
    "Risk 1 : Reward 4 - Profit 4% - Lost 15 Orders",
    "Risk 1 : Reward 10 - Profit 17% - Lost 20 Orders",
    "Risk 1 : Reward 2 - Profit 15% - Lost 5 Orders",
    "Risk 1 : Reward 2 - Profit 30% - Lost 3 Orders",
  ];

  const getStrategyIndex = (strategy) => {
    const index = strategyOptions.indexOf(strategy);
    return index !== -1 ? index : -1; // Trả về -1 nếu không tìm thấy
  };

  const handleSave = async () => {
    try {
      // Kiểm tra khi tắt Capital Management
      if (!isStrategyManagementOn && (!numericValue || parseInt(numericValue) <= 0)) {
        alert("Stop Loss value must be a positive number greater than 0.");
        return;
      }

      // Tạo payload từ dữ liệu đã thay đổi (dữ liệu đầu vào)
      const capitalManagementValue = isStrategyManagementOn ? getStrategyIndex(selectedStrategy) : -1;
      const entryTypeValue = capitalManagementValue >= 0 ? 1 : 2;
      const payload = {
        userID: userID,
        accountMT5: accountMT5,
        signal_id: signal_id,
        isEntry: isEntryOn ? 1 : 0,
        capitalManagement: capitalManagementValue,
        entryType: entryTypeValue,
        SLUSD: isStrategyManagementOn ? 0 : (!isStrategyManagementOn && numericValue ? parseInt(numericValue) : 0),
      };

      console.log("Sending API payload:", payload); // Debug payload

      const response = await fetch(
        "https://admin.tducoin.com/api/signal/signalcontroller",
        {
          method: "POST",
          headers: {
            "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("API Error Response:", errorResponse);
        throw new Error(errorResponse.message || "Failed to update signal controller");
      }

      // Lấy response text từ API
      const apiResponseText = await response.text();
      await sendTadaServer1Message(`${apiResponseText},${port_id}`);

      // Cập nhật sessionStorage với payload (dữ liệu đầu vào)
      const cachedControllerData = sessionStorage.getItem("controllerData");
      let controllerDataArray = cachedControllerData ? JSON.parse(cachedControllerData) : [];

      if (!Array.isArray(controllerDataArray)) {
        controllerDataArray = []; // Khởi tạo lại nếu dữ liệu không phải mảng
      }

      const index = controllerDataArray.findIndex(
        (item) => item.signal_id === signal_id
      );

      if (index !== -1) {
        controllerDataArray[index] = payload; // Cập nhật dữ liệu cũ
      } else {
        controllerDataArray.push(payload); // Thêm mới nếu chưa có
      }

      sessionStorage.setItem("controllerData", JSON.stringify(controllerDataArray));

      // Không cập nhật userData trong sessionStorage, thay vào đó gửi payload qua onUserDataUpdate
      if (onUserDataUpdate) {
        onUserDataUpdate(payload); // Truyền payload thay vì updatedData
      }

      // Cập nhật state để phản ánh giao diện
      setIsStrategyManagementOn(payload.capitalManagement >= 0);
      setSelectedStrategy(payload.capitalManagement >= 0 ? strategyOptions[payload.capitalManagement] : "");
      setNumericValue(payload.SLUSD ? payload.SLUSD.toString() : "");
      setIsEntryOn(payload.isEntry === 1); // Cập nhật isEntryOn từ payload

      setIsModified(false);
    } catch (error) {
      console.error("Error in handleSave:", error);
      <TelegramNotification
        message={
          "Lỗi POST Save tùy chỉnh component Strategy: " +
          error.message +
          " từ user " +
          userID
        }
      />;
    }
  };

  // Hàm để cập nhật selectedStrategy khi người dùng chọn từ dropdown
  const handleStrategyChange = (strategy) => {
    setSelectedStrategy(strategy);
    setIsModified(true);
  };

  // Hàm để cập nhật sessionStorage (giữ lại nhưng không dùng trong handleSave nữa)
  const setUserData = (updater) => {
    const cachedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
    const newUserData = updater(cachedUserData);
    sessionStorage.setItem("userData", JSON.stringify(newUserData));
    if (onUserDataUpdate) {
      onUserDataUpdate(newUserData.trading_accounts);
    }
  };

  return (
    <div className="signal-container">
      <div className="portfolio-header-title">
        <img src={botsettingIcon} alt="Balance Icon" className="portfolio-icon" />
        <span>Customize</span>
      </div>
      <hr className="portfolio-divider-fullwidth" />

      <div className="signal-body">
        {/* Strategy Management */}
        <div className="signal-body-item">
          <span className="icon">🎯</span>
          <span className="text">Capital Management</span>
          <div className="strategy-toggle">
            <div
              className={`strategy-switch ${isStrategyManagementOn ? "on" : "off"}`}
              onClick={() => {
                setIsStrategyManagementOn((prev) => !prev);
                setIsModified(true);
                if (isStrategyManagementOn) {
                  setSelectedStrategy("");
                } else {
                  setNumericValue("");
                }
              }}
            >
              <div className="strategy-knob"></div>
            </div>
          </div>
        </div>

        {isStrategyManagementOn ? (
          <div style={{ marginBottom: "15px" }}>
            <div className="signal-body-item">
              <div className="dropdown" style={{ width: "100%" }}>
                <div
                  className="dropdown-header"
                  onClick={toggleDropdown}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <span className="text" style={{ fontWeight: isDropdownOpen ? "bold" : "normal" }}>
                    {selectedStrategy || "Select Strategy"}
                  </span>
                  <span className="dropdown-arrow">
                    <img 
                      src={isDropdownOpen ? upIcon : downIcon} 
                      alt="Toggle Icon" 
                      className="dropdown-icon" 
                    />
                  </span>
                </div>
                <div
                  ref={dropdownRef}
                  className="dropdown-menu"
                  style={{
                    height: dropdownHeight ? `${dropdownHeight}px` : "0px",
                    overflow: "hidden",
                    transition: "height 0.3s ease-in-out",
                    padding: isDropdownOpen ? "6px 5px" : "0",
                  }}
                >
                  {strategyOptions.map((strategy) => (
                    <div key={strategy} className="dropdown-item">
                      <label className="strategy-radio-option" style={{ fontWeight: "normal" }}>
                        <input
                          type="radio"
                          name="strategy"
                          value={strategy}
                          checked={selectedStrategy === strategy}
                          onChange={(e) => handleStrategyChange(e.target.value)}
                        />
                        {strategy}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="signal-body-item">
            <input
              type="number"
              className="strategy-number-input"
              placeholder="Enter a Stop Loss value"
              value={numericValue}
              onChange={(e) => {
                setNumericValue(e.target.value);
                setIsModified(true);
              }}
            />
          </div>
        )}

        {/* Move entry */}
        <div className="signal-body-item">
          <span className="icon">⚖️</span>
          <span className="text">Place Stop Loss to Entry</span>
          <div className="strategy-toggle">
            <div
              className={`strategy-switch ${isEntryOn ? "on" : "off"}`}
              onClick={() => {
                setIsEntryOn((prev) => !prev);
                setIsModified(true);
              }}
            >
              <div className="strategy-knob"></div>
            </div>
          </div>
        </div>
      </div>

      {isModified && (
        <div className="strategy-footer">
          <button className="strategy-footer-button" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ControllerSignal;