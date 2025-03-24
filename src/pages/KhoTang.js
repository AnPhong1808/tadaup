import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ReloadSkeleton, PreloadImage } from "../components/waiting";
import Header from "../components/Header";
import News from "../components/News";
import TadaTV from "../components/TadaTV";
import Course from "../components/Course";
import Footer from "../components/Footer";
import "./KhoTang.css";
import { preloadData } from "./api";

// Sử dụng forwardRef cho News nếu cần ref (nếu News là function component)
const NewsWithRef = React.forwardRef((props, ref) => <News {...props} ref={ref} />);

function KhoTang() {
  const [activeTab, setActiveTab] = useState(() => {
    const fromCourseDetail = sessionStorage.getItem("fromCourseDetail");
    sessionStorage.removeItem("fromCourseDetail"); // Reset để không ảnh hưởng lần sau
    return fromCourseDetail ? "khoahoc" : "tintuc"; // Nếu từ CourseDetail về thì mở tab "Khoá học"
  });
  const [activeCatalogue, setActiveCatalogue] = useState("All"); // Loại tin tức (Crypto, Forex,...)
  const [dataType, setDataType] = useState(() => {
    return activeTab === "khoahoc" ? "Courses" : "Tin tức";
  });
  const [newsData, setNewsData] = useState([]); // Dữ liệu cho News
  const [tadaTVData, setTadaTVData] = useState([]); // Dữ liệu cho TadaTV
  const [courseData, setCourseData] = useState([]); // Dữ liệu cho Courses
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [userData, setUserData] = useState(null);
  const [newsPage, setNewsPage] = useState(1); // Trang cho News
  const [tadaTVPage, setTadaTVPage] = useState(1); // Trang cho TadaTV
  const [coursePage, setCoursePage] = useState(1); // Trang cho Courses
  const [newsHasMore, setNewsHasMore] = useState(true); // Còn dữ liệu News để tải
  const [tadaTVHasMore, setTadaTVHasMore] = useState(true); // Còn dữ liệu TadaTV để tải
  const [courseHasMore, setCourseHasMore] = useState(true); // Còn dữ liệu Courses để tải
  const [isFetching, setIsFetching] = useState(false); // Trạng thái đang tải thêm
  const [isInitialized, setIsInitialized] = useState(false); // Kiểm soát khởi tạo dữ liệu ban đầu

  const navigate = useNavigate();
  const [direction, setDirection] = useState(1); // Hướng trượt
  const observer = useRef();

  const apiKey = "oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE";

  // Xử lý cuộn toàn cục để tải thêm dữ liệu
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 200 && !isFetching && userData && userData.userID) {
        if (activeTab === "tintuc" && newsHasMore) {
          setNewsPage((prevPage) => {
            console.log("Increasing newsPage from:", prevPage, "to:", prevPage + 1);
            const nextPage = prevPage + 1;
            fetchMoreNews(nextPage);
            return nextPage;
          });
        } else if (activeTab === "tadatv" && tadaTVHasMore) {
          setTadaTVPage((prevPage) => {
            console.log("Increasing tadaTVPage from:", prevPage, "to:", prevPage + 1);
            const nextPage = prevPage + 1;
            fetchMoreTadaTV(nextPage);
            return nextPage;
          });
        } else if (activeTab === "khoahoc" && courseHasMore) {
          setCoursePage((prevPage) => {
            console.log("Increasing coursePage from:", prevPage, "to:", prevPage + 1);
            const nextPage = prevPage + 1;
            fetchMoreCourses(nextPage);
            return nextPage;
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, activeTab, newsHasMore, tadaTVHasMore, courseHasMore, userData]);

  const handleItemClick = (Id, userId) => {
    navigate(`/${dataType}/${Id}`, { state: { userId } });
  };

  // Hàm tải thêm dữ liệu cho News
  const fetchMoreNews = async (pageToFetch) => {
    if (isFetching || !newsHasMore) return;
    setIsFetching(true);

    console.log("fetchMoreNews - userData before check:", userData, "pageToFetch:", pageToFetch); // Log để kiểm tra userData và page
    if (!userData || !userData.userID) {
      console.error("userData is null or missing userID, skipping...");
      setIsFetching(false);
      return; // Không thử lại, chỉ log và dừng
    }

    try {
      const newData = await preloadData(apiKey, userData.userID, pageToFetch, 10, null, "Tin tức");
      console.log("fetchMoreNews - page:", pageToFetch, "newData:", newData); // Log dữ liệu từ API
      const normalizedNewData = (newData.newsData || []).map(item => ({
        ...item,
      }));
      if (normalizedNewData.length > 0) { // Chỉ cập nhật nếu có dữ liệu mới
        setNewsData((prevData) => {
          // Loại bỏ trùng lặp dựa trên id
          const uniqueNewData = normalizedNewData.filter(newItem => 
            !prevData.some(prevItem => prevItem.id === newItem.id)
          );
          const updatedData = [...prevData, ...uniqueNewData].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          sessionStorage.setItem("newsData", JSON.stringify(updatedData));
          console.log("fetchMoreNews - updated newsData (unique):", updatedData); // Log dữ liệu sau khi cập nhật
          return updatedData;
        });
      }
      setNewsHasMore(newData.newsHasMore);
    } catch (error) {
      console.error("Error fetching more news:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Hàm tải thêm dữ liệu cho TadaTV (giữ nguyên)
  const fetchMoreTadaTV = async (pageToFetch) => {
    if (isFetching || !tadaTVHasMore) return;
    setIsFetching(true);

    console.log("fetchMoreTadaTV - userData before check:", userData, "pageToFetch:", pageToFetch); // Log để kiểm tra userData và page
    if (!userData || !userData.userID) {
      console.error("userData is null or missing userID, skipping...");
      setIsFetching(false);
      return; // Không thử lại, chỉ log và dừng
    }

    try {
      const newData = await preloadData(apiKey, userData.userID, pageToFetch, 10, null, "TadaTV");
      console.log("fetchMoreTadaTV - page:", pageToFetch, "newData:", newData); // Log dữ liệu từ API
      const normalizedNewData = (newData.newsData || []).map(item => ({
        ...item,
      }));
      if (normalizedNewData.length > 0) { // Chỉ cập nhật nếu có dữ liệu mới
        setTadaTVData((prevData) => {
          const updatedData = [...prevData, ...normalizedNewData].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          sessionStorage.setItem("tadaTVData", JSON.stringify(updatedData));
          console.log("fetchMoreTadaTV - updated tadaTVData:", updatedData); // Log dữ liệu sau khi cập nhật
          return updatedData;
        });
      }
      setTadaTVHasMore(newData.newsHasMore);
    } catch (error) {
      console.error("Error fetching more TadaTV:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Hàm tải thêm dữ liệu cho Courses (giữ nguyên)
  const fetchMoreCourses = async (pageToFetch) => {
    if (isFetching || !courseHasMore) return;
    setIsFetching(true);

    console.log("fetchMoreCourses - userData before check:", userData, "pageToFetch:", pageToFetch); // Log để kiểm tra userData và page
    if (!userData || !userData.userID) {
      console.error("userData is null or missing userID, skipping...");
      setIsFetching(false);
      return; // Không thử lại, chỉ log và dừng
    }

    try {
      const newData = await preloadData(apiKey, userData.userID, pageToFetch, 10);
      const normalizedNewData = (newData.courseData || []).map(item => ({
        ...item,
      }));
      if (normalizedNewData.length > 0) { // Chỉ cập nhật nếu có dữ liệu mới
        setCourseData((prevData) => {
          const updatedData = [...prevData, ...normalizedNewData].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
          sessionStorage.setItem("courseData", JSON.stringify(updatedData));
          console.log("fetchMoreCourses - updated courseData:", updatedData); // Log dữ liệu sau khi cập nhật
          return updatedData;
        });
      }
      setCourseHasMore(newData.courseData && newData.courseData.length > 0);
    } catch (error) {
      console.error("Error fetching more courses:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // Lấy dữ liệu từ sessionStorage khi khởi tạo (giữ nguyên)
  useEffect(() => {
    const cachedUserData = sessionStorage.getItem("userData");
    const cachedNewsData = sessionStorage.getItem("newsData");
    const cachedTadaTVData = sessionStorage.getItem("tadaTVData");
    const cachedCourseData = sessionStorage.getItem("courseData");

    if (cachedUserData) {
      setUserData(JSON.parse(cachedUserData));
    } else {
      console.error("No user data found in sessionStorage!");
      return;
    }

    const newsInitial = JSON.parse(cachedNewsData || "[]").sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const tadaTVInitial = JSON.parse(cachedTadaTVData || "[]").sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    const courseInitial = JSON.parse(cachedCourseData || "[]").sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setNewsData(newsInitial);
    setTadaTVData(tadaTVInitial);
    setCourseData(courseInitial);

    setLoading(false);
  }, []); // Chỉ chạy một lần khi component mount

  // Tải dữ liệu ban đầu nếu sessionStorage rỗng và chưa khởi tạo (giữ nguyên)
  useEffect(() => {
    if (!userData || !userData.userID || isInitialized) return;

    const loadInitialData = async () => {
      console.log("Loading initial data, userData:", userData, "isInitialized:", isInitialized);
      if (newsData.length === 0) {
        await fetchMoreNews(1);
      }
      if (tadaTVData.length === 0) {
        await fetchMoreTadaTV(1);
      }
      if (courseData.length === 0) {
        await fetchMoreCourses(1);
      }
      setIsInitialized(true); // Đánh dấu đã khởi tạo
    };

    loadInitialData().catch(error => console.error("Error loading initial data:", error));
  }, [userData, newsData.length, tadaTVData.length, courseData.length, isInitialized]);

  // Reset trang khi chuyển tab (giữ nguyên)
  useEffect(() => {
    console.log("Resetting pages for tab:", activeTab);
    if (activeTab === "tintuc") {
      setNewsPage(1);
      setNewsHasMore(true); // Reset newsHasMore khi chuyển tab
    } else if (activeTab === "tadatv") {
      setTadaTVPage(1);
      setTadaTVHasMore(true); // Reset tadaTVHasMore khi chuyển tab
    } else if (activeTab === "khoahoc") {
      setCoursePage(1);
      setCourseHasMore(true); // Reset courseHasMore khi chuyển tab
    }
  }, [activeTab]);

  // Cập nhật dataType khi chuyển tab (giữ nguyên)
  useEffect(() => {
    if (activeTab === "tintuc") setDataType("Tin tức");
    if (activeTab === "tadatv") setDataType("TadaTV");
    if (activeTab === "khoahoc") setDataType("Courses");
  }, [activeTab]);

  const newsStatusMap = useMemo(
    () => new Map(userData?.news_reads?.map((read) => [read.news_id, true])),
    [userData]
  );

  // Lọc dữ liệu hiển thị theo dataType và catalogue (giữ nguyên)
  const filteredData = (activeTab === "tintuc" ? newsData : activeTab === "tadatv" ? tadaTVData : courseData).filter(item =>
    (dataType === "All" || item.dataType === dataType) &&
    (activeCatalogue === "All" || item.catalogues === activeCatalogue)
  );

  const lastElementRef = useCallback(
    (node) => {
      if (isFetching || !node || !userData || !userData.userID) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (activeTab === "tintuc" && newsHasMore) {
              setNewsPage((prevPage) => {
                const nextPage = prevPage + 1;
                fetchMoreNews(nextPage);
                return nextPage;
              });
            } else if (activeTab === "tadatv" && tadaTVHasMore) {
              setTadaTVPage((prevPage) => {
                const nextPage = prevPage + 1;
                fetchMoreTadaTV(nextPage);
                return nextPage;
              });
            } else if (activeTab === "khoahoc" && courseHasMore) {
              setCoursePage((prevPage) => {
                const nextPage = prevPage + 1;
                fetchMoreCourses(nextPage);
                return nextPage;
              });
            }
          }
        },
        { threshold: 0.1 }
      );
      observer.current.observe(node);
    },
    [isFetching, userData, activeTab, newsHasMore, tadaTVHasMore, courseHasMore]
  );

  // Đổi tab (news, tadatv, course) (giữ nguyên)
  const handleTabClick = (tab, type) => {
    setDirection(type === "Tin tức" ? 1 : -1); // Xác định hướng trượt
    setActiveTab(tab);
    setDataType(type); // "Tin tức", "TadaTV", hoặc "Courses"
    setActiveCatalogue("All"); // Reset catalogue khi đổi tab
  };

  if (!userData) {
    return <ReloadSkeleton />;
  }

  return (
    <div className="App">
      <Header walletAC={userData.wallet_AC} userId={userData.userID} />
      <main>
        {/* Tab Menu */}
        <div className="tab-menu">
          <button
            className={`btn_tintuc ${activeTab === "tintuc" ? "active" : ""}`}
            onClick={() => handleTabClick("tintuc", "Tin tức")}
          >
            News
          </button>
          <button
            className={`btn_tadatv ${activeTab === "tadatv" ? "active" : ""}`}
            onClick={() => handleTabClick("tadatv", "TadaTV")}
          >
            TadaTV
          </button>
          <button
            className={`btn_khoahoc ${activeTab === "khoahoc" ? "active" : ""}`}
            onClick={() => handleTabClick("khoahoc", "Courses")}
          >
            Courses
          </button>
        </div>

        {/* Nội dung thay đổi theo tab */}
        <div className="content-container">
          {loading ? (
            <ReloadSkeleton />
          ) : (
            filteredData.map((item, index) => {
              const isLastElement = index === filteredData.length - 1;
              if (item.dataType === "Tin tức") {
                return (
                  <div key={item.id} onClick={() => handleItemClick(item.id)}>
                    <NewsWithRef // Sử dụng NewsWithRef để xử lý ref
                      ref={isLastElement ? lastElementRef : null}
                      title={item.title}
                      description={item.description}
                      banner={item.banner}
                      heartValue={item.heart}
                      commentValue={item.comment}
                      ac={item.ac}
                      author={item.author}
                      created_at={item.created_at}
                      status={newsStatusMap.has(item.id) ? 0 : 1}
                    />
                  </div>
                );
              } else if (item.dataType === "TadaTV") {
                return (
                  <div key={item.id} onClick={() => handleItemClick(item.id)}>
                    <TadaTV
                      ref={isLastElement ? lastElementRef : null}
                      title={item.title}
                      description={item.description}
                      pic={item.banner}
                      heartValue={item.heart}
                      commentValue={item.comment}
                      clip={item.clip}
                      ac={item.ac}
                      name={item.author}
                      time={item.created_at}
                      status={newsStatusMap.has(item.id) ? 0 : 1}
                    />
                  </div>
                );
              } else if (item.dataType === "Courses") {
                return (
                  <div key={item.id} onClick={() => handleItemClick(item.id)}>
                    <Course
                      ref={isLastElement ? lastElementRef : null}
                      title={item.title}
                      description={item.description}
                      banner={item.banner}
                      ac={item.ac}
                      completion={item.completion}
                      status={1}
                    />
                  </div>
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
      </main>
      <Footer />
    </div>
  );
}

export default KhoTang;