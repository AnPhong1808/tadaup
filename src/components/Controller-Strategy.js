import React, { useState, useRef, useEffect } from "react";
import "./Signal.css";
import "./Controller-Strategy.css";
import botsettingIcon from "./assets/icons/bot-setting.png";
import upIcon from "./assets/icons/up.png";
import downIcon from "./assets/icons/down.png";
import TelegramNotification, { sendTadaServer1Message } from './TelegramNotification';

const ControllerStrategy = ({ userID, accountMT5, trading_accounts, port_id, onUserDataUpdate }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAutoBotOn, setIsAutoBotOn] = useState(false);
  const [isStrategyManagementOn, setIsStrategyManagementOn] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [selectedChannels, setSelectedChannels] = useState([]);
  const [numericValue, setNumericValue] = useState("");
  const [channelsDropdownOpen, setChannelsDropdownOpen] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [authorDropdowns, setAuthorDropdowns] = useState({});
  const [selectedAuthorStrategies, setSelectedAuthorStrategies] = useState({});
  const [bookingChannels, setBookingChannels] = useState([]);
  const [initialState, setInitialState] = useState({});

  const dropdownRef = useRef(null);
  const channelsDropdownRef = useRef(null);
  const authorDropdownRefs = useRef({});

  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [channelsDropdownHeight, setChannelsDropdownHeight] = useState(0);
  const [authorDropdownHeights, setAuthorDropdownHeights] = useState({});

  const currentAccount = trading_accounts?.find(
    (account) => account.accountMT5 === accountMT5
  );

  const followingChannels = currentAccount?.following_channels || [];
  const capitalManagement = currentAccount?.capitalManagement || "";

  useEffect(() => {
    if (currentAccount) {
      setIsAutoBotOn(followingChannels.some((channel) => channel.autoCopy === 1));
      setIsStrategyManagementOn(capitalManagement !== "None" && followingChannels.some((channel) => channel.capitalManagement >= 0));
      setSelectedStrategy(capitalManagement);
      setNumericValue(currentAccount.orderSL || "");
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

      setInitialState({
        isAutoBotOn: followingChannels.some((channel) => channel.autoCopy === 1),
        isStrategyManagementOn: capitalManagement !== "None" && followingChannels.some((channel) => channel.capitalManagement >= 0),
        selectedChannels: initialChannels,
        selectedAuthorStrategies: { ...initialStrategies },
        numericValue: currentAccount.orderSL || "",
      });
    }

    const cachedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
    setBookingChannels(cachedUserData.booking_channels || []);
  }, [currentAccount, followingChannels, capitalManagement]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      const updatedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
      setBookingChannels(updatedUserData.booking_channels || []);
    };

    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

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
      if (!isStrategyManagementOn && (!numericValue || parseInt(numericValue) <= 0)) {
        alert("Giá trị Stop Loss phải là số dương lớn hơn 0.");
        return;
      }

      const changedChannels = [];
      bookingChannels.forEach(channel => {
        const author = channel.author;
        const wasSelectedInitially = initialState.selectedChannels.includes(author);
        const isSelectedNow = selectedChannels.includes(author);
        const initialStrategy = initialState.selectedAuthorStrategies[author] || "";
        const currentStrategy = selectedAuthorStrategies[author] || "";
        const initialAutoBot = initialState.isAutoBotOn;
        const initialManagement = initialState.isStrategyManagementOn;
        
        if (
          (initialAutoBot !== isAutoBotOn) ||
          (wasSelectedInitially !== isSelectedNow) ||
          (initialManagement !== isStrategyManagementOn) ||
          (isStrategyManagementOn && initialStrategy !== currentStrategy) ||
          (!isStrategyManagementOn && initialState.numericValue !== numericValue)
        ) {
          changedChannels.push(author);
        }
      });

      if (changedChannels.length === 0) {
        setIsModified(false);
        return;
      }

      let lastConfigString = "";
      let apiCallCount = 0;

      for (const author of changedChannels) {
        const existingChannel = followingChannels.find(ch => ch.author === author);
        const bookingChannel = bookingChannels.find(ch => ch.author === author);
        
        const channelId = existingChannel ? existingChannel.channel_id : (bookingChannel ? bookingChannel.channel_id : null);
        
        if (!channelId) {
          console.error(`Không tìm thấy channel_id cho author ${author}`);
          continue;
        }

        const isSelected = selectedChannels.includes(author);
        const capitalManagementValue = isStrategyManagementOn
          ? (isSelected ? getStrategyIndex(selectedAuthorStrategies[author] || "") : -1)
          : -1; // Chỉ gán -1 khi tắt nút Capital Management
        const entryTypeValue = capitalManagementValue >= 0 ? 1 : 2;

        const payload = {
          userID: userID,
          accountMT5: accountMT5,
          channel_id: channelId,
          capitalManagement: capitalManagementValue,
          entryType: entryTypeValue,
          SLUSD: isStrategyManagementOn ? 0 : (!isStrategyManagementOn && numericValue ? numericValue : (existingChannel?.SLUSD || 0)),
          autoCopy: isAutoBotOn && isSelected ? 1 : 0,
        };

        console.log(`Gửi API cho ${author} (lần ${apiCallCount + 1}):`, payload);

        const response = await fetch(
          "https://admin.tducoin.com/api/signal/channelcontroller",
          {
            method: "POST",
            headers: {
              "x-api-key": "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        apiCallCount++;

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("Phản hồi lỗi API cho kênh", channelId, ":", errorResponse);
          <TelegramNotification
            message={
              "Lỗi POST Save tùy chỉnh component Strategy cho kênh " +
              channelId +
              ": " +
              errorResponse.message +
              " từ user " +
              userID
            }
          />;
          throw new Error(`API thất bại cho kênh ${channelId}`);
        }

        lastConfigString = await response.text();
      }

      if (apiCallCount > 0) {
        await sendTadaServer1Message(`${lastConfigString},${port_id}`);
      }

      const cachedUserData = JSON.parse(sessionStorage.getItem("userData")) || {};
      const allChannels = bookingChannels.map(channel => channel.author);
      const newFollowingChannels = allChannels.map(author => {
        const existingChannel = followingChannels.find(ch => ch.author === author);
        const bookingChannel = bookingChannels.find(ch => ch.author === author);
        const channelId = existingChannel ? existingChannel.channel_id : (bookingChannel ? bookingChannel.channel_id : null);
        const isSelected = selectedChannels.includes(author);
        const capitalManagementValue = isStrategyManagementOn
          ? (isSelected ? getStrategyIndex(selectedAuthorStrategies[author] || "") : -1)
          : -1;
        const entryTypeValue = capitalManagementValue >= 0 ? 1 : 2;

        return {
          channel_id: channelId,
          accountMT5: accountMT5,
          isEntry: existingChannel?.isEntry || false,
          entryType: entryTypeValue,
          isReverse: existingChannel?.isReverse || false,
          capitalManagement: capitalManagementValue,
          SLUSD: isStrategyManagementOn ? 0 : (!isStrategyManagementOn && numericValue ? numericValue : (existingChannel?.SLUSD || 0)),
          author: author,
          autoCopy: isAutoBotOn && isSelected ? 1 : 0,
          done_at: existingChannel?.done_at || null,
        };
      });

      const updatedFollowingChannels = [
        ...followingChannels.filter(ch => !allChannels.includes(ch.author)),
        ...newFollowingChannels
      ];

      const updatedUserData = {
        ...cachedUserData,
        trading_accounts: cachedUserData.trading_accounts.map((account) =>
          account.accountMT5 === accountMT5
            ? {
                ...account,
                following_channels: updatedFollowingChannels,
                capitalManagement: isStrategyManagementOn ? "Custom" : "None",
                orderSL: !isStrategyManagementOn && numericValue ? numericValue : account.orderSL || 0,
              }
            : account
        ),
      };

      console.log("Dữ liệu userData đã cập nhật:", updatedUserData);
      sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
      setBookingChannels(updatedUserData.booking_channels || []);

      if (onUserDataUpdate) {
        onUserDataUpdate(updatedUserData.trading_accounts);
      }

      setInitialState({
        isAutoBotOn,
        isStrategyManagementOn,
        selectedChannels: [...selectedChannels],
        selectedAuthorStrategies: { ...selectedAuthorStrategies },
        numericValue,
      });
      setIsModified(false);
    } catch (error) {
      console.error("Lỗi trong handleSave:", error);
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

  return (
    <div className="signal-container">
      <div className="portfolio-header-title">
        <img src={botsettingIcon} alt="Balance Icon" className="portfolio-icon" />
        <span>Main Controller</span>
      </div>
      <hr className="portfolio-divider-fullwidth" />

      <div className="signal-body">
        {/* Auto Bot */}
        <div className="signal-body-item">
          <span className="icon">🤖</span>
          <span className="text">Followng Channels</span>
          <div className="strategy-toggle">
            <div
              className={`strategy-switch ${isAutoBotOn ? "on" : "off"}`}
              onClick={() => {
                setIsAutoBotOn(!isAutoBotOn);
                setIsModified(true);
              }}
            >
              <div className="strategy-knob"></div>
            </div>
          </div>
        </div>

        {isAutoBotOn && (
          <div className="signal-body-item" style={{ marginBottom: "15px" }}>
            <div className="dropdown">
              <div
                className="dropdown-header"
                onClick={toggleChannelsDropdown}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <span className="text">Channels List</span>
                <span className="dropdown-arrow">
                  <img src={channelsDropdownOpen ? upIcon : downIcon} alt="Toggle Icon" className="dropdown-icon" />
                </span>
              </div>
              <div
                ref={channelsDropdownRef}
                className="dropdown-menu"
                style={{
                  height: channelsDropdownHeight ? `${channelsDropdownHeight}px` : "0px",
                  overflow: "hidden",
                  transition: "height 0.3s ease-in-out",
                  padding: channelsDropdownOpen ? "6px 5px" : "0",
                }}
              >
                {bookingChannels.length > 0 ? (
                  bookingChannels.map((channel) => (
                    <div key={channel.author} className="dropdown-item" style={{ display: "flex", alignItems: "center", padding: "6px 5px" }}>
                      <input
                        type="checkbox"
                        value={channel.author}
                        checked={selectedChannels.includes(channel.author)}
                        onChange={() => {
                          setSelectedChannels((prev) => {
                            const newChannels = prev.includes(channel.author)
                              ? prev.filter((ch) => ch !== channel.author)
                              : [...prev, channel.author];
                            setAuthorDropdowns(prevDropdowns => {
                              const newDropdowns = { ...prevDropdowns };
                              if (!newChannels.includes(channel.author)) {
                                delete newDropdowns[channel.author];
                              } else {
                                newDropdowns[channel.author] = false;
                              }
                              return newDropdowns;
                            });
                            setSelectedAuthorStrategies(prevStrats => {
                              const newStrats = { ...prevStrats };
                              if (!newChannels.includes(channel.author)) {
                                delete newStrats[channel.author];
                              }
                              return newStrats;
                            });
                            return newChannels;
                          });
                          setIsModified(true);
                        }}
                        style={{ marginRight: "8px" }}
                      />
                      <label className="strategy-checkbox-option" style={{ flex: 1 }}>
                        {channel.author}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item" style={{ padding: "6px 5px", textAlign: "center" }}>
                    No result
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Strategy Management */}
        <div className="signal-body-item">
          <span className="icon">🎯</span>
          <span className="text">Capital Management</span>
          <div className="strategy-toggle">
            <div
              className={`strategy-switch ${isStrategyManagementOn ? "on" : "off"}`}
              onClick={() => {
                setIsAutoBotOn(true);
                setIsStrategyManagementOn(!isStrategyManagementOn);
                setIsModified(true);
                if (!isStrategyManagementOn) {
                  setSelectedStrategy("");
                  setSelectedAuthorStrategies({});
                }
                setNumericValue(currentAccount?.orderSL || "");
              }}
            >
              <div className="strategy-knob"></div>
            </div>
          </div>
        </div>

        {isStrategyManagementOn ? (
          <div style={{ marginBottom: "15px" }}>
            {selectedChannels.map((author) => (
              <div key={author} className="signal-body-item">
                <div className="dropdown" style={{ width: "100%" }}>
                  <div
                    className="dropdown-header"
                    onClick={() => toggleAuthorDropdown(author)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <span 
                      className="text"
                      style={{ fontWeight: authorDropdowns[author] ? "bold" : "normal" }}
                    >
                      {author}
                    </span>
                    <span className="dropdown-arrow">
                      <img 
                        src={authorDropdowns[author] ? upIcon : downIcon} 
                        alt="Toggle Icon" 
                        className="dropdown-icon" 
                      />
                    </span>
                  </div>
                  <div
                    ref={el => authorDropdownRefs.current[author] = el}
                    className="dropdown-menu"
                    style={{
                      height: authorDropdownHeights[author] ? `${authorDropdownHeights[author]}px` : "0px",
                      overflow: "hidden",
                      transition: "height 0.3s ease-in-out",
                      padding: authorDropdowns[author] ? "6px 5px" : "0",
                    }}
                  >
                    {strategyOptions.map((strategy) => (
                      <div key={strategy} className="dropdown-item">
                        <label className="strategy-radio-option" style={{ fontWeight: "normal" }}>
                          <input
                            type="radio"
                            name={`strategy-${author}`}
                            value={strategy}
                            checked={selectedAuthorStrategies[author] === strategy}
                            onChange={(e) => {
                              setSelectedAuthorStrategies(prev => ({
                                ...prev,
                                [author]: e.target.value
                              }));
                              setIsModified(true);
                            }}
                          />
                          {strategy}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="signal-body-item">
            <input
              type="number"
              className="strategy-number-input"
              placeholder="Enter the Stop Loss value"
              value={numericValue}
              onChange={(e) => {
                setNumericValue(e.target.value);
                setIsModified(true);
              }}
            />
          </div>
        )}
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

export default ControllerStrategy;