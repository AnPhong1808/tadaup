import React, { useState, useEffect, useRef } from 'react';
import "./Setting-Menu.css";
import "./Setting-Format.css";
import "./Affiliate.css";
import { ReloadSkeleton } from "../components/waiting"; // Chỉ giữ ReloadSkeleton để đơn giản

function AffiliateProfit({ user, onBack }) {
  const [selectedMember, setSelectedMember] = useState(null); // Track the selected member
  const [members, setMembers] = useState([]); // Store the list of members
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const intervalRef = useRef(null); // Lưu tham chiếu đến interval

  // Hàm gọi API để lấy danh sách thành viên
  const fetchMembers = async () => {
    try {
      setIsLoading(true); // Bắt đầu loading
      const response = await fetch(`https://admin.tducoin.com/api/webappuser/affiliatemembers/${user}`, {
        headers: {
          'x-api-key': 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE',
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (data.success) {
        setMembers(data.data); // Cập nhật danh sách thành viên
        console.log('Fetched affiliate members:', data.data);
      } else {
        console.error("Failed to fetch members:", data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  // Kiểm tra thay đổi totalCommission trong sessionStorage
  const checkSessionStorageChange = () => {
    let prevTotalCommission = null;
    return () => {
      const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
      const currentTotalCommission = userData.totalCommission || 0;
      if (prevTotalCommission !== null && currentTotalCommission !== prevTotalCommission) {
        console.log('Detected totalCommission change:', currentTotalCommission);
        fetchMembers();
      }
      prevTotalCommission = currentTotalCommission;
    };
  };

  useEffect(() => {
    // Gọi API lần đầu khi component mount
    fetchMembers();

    // Lắng nghe sự thay đổi từ các tab khác
    const handleStorageChange = (event) => {
      if (event.key === "userData") {
        const updatedUserData = JSON.parse(event.newValue || '{}');
        console.log('Detected userData change from another tab:', updatedUserData);
        fetchMembers();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Chỉ chạy interval khi component đang hiển thị
    const startMonitoring = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(checkSessionStorageChange(), 2000); // Kiểm tra mỗi 2 giây
        console.log('Started monitoring totalCommission');
      }
    };

    const stopMonitoring = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('Stopped monitoring totalCommission');
      }
    };

    startMonitoring();

    // Dùng IntersectionObserver để kiểm tra khi component không còn trong viewport (tùy chọn)
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          startMonitoring();
        } else {
          stopMonitoring();
        }
      },
      { threshold: 0 }
    );

    const container = document.querySelector('.menu-container');
    if (container) observer.observe(container);

    // Cleanup khi component unmount
    return () => {
      stopMonitoring();
      window.removeEventListener("storage", handleStorageChange);
      if (container) observer.unobserve(container);
    };
  }, []);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
  };

  const BASE_URL = 'https://admin.tducoin.com/public/';

  // Tính tổng ac_bonus của tất cả các thành viên
  const totalAcBonus = members.reduce((total, member) => total + (member.ac_bonus || 0), 0);

  if (isLoading) {
    return (
      <div className="menu-container">
        <ReloadSkeleton />
      </div>
    );
  }

  return (
    <div className="menu-container">
      <div className="total-ac-bonus">
        <span>Total Affiliate Commission</span>
        <span className="ac-bonus-value"><b>{totalAcBonus} AC</b></span>
      </div>

      {members.map((member, index) => (
        <div key={member.memberID}>
          <div className="menu-item">
            <button className="menu-button" onClick={() => handleSelectMember(member)}>
              <img
                src={member.avatar ? `${BASE_URL}${member.avatar}` : `${BASE_URL}images/avatars/9999.jpg`}
                alt="icon"
                className={`affiliate-icon-left ${!member.avatar ? "affiliate-default-avatar" : ""}`}
              />
              <span><b>{member.name}</b></span>
              <div className="icon-right">
                <span>+{member.ac_bonus || 0} AC</span>
              </div>
            </button>
          </div>
          {index < members.length - 1 && <div className="divider"></div>}
        </div>
      ))}
    </div>
  );
}

export default AffiliateProfit;