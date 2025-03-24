import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './NewsDetail.css';
import sharingIcon from '../components/assets/icons/sharing.png';
import backIcon from '../components/assets/icons/back.png';
import socialIcon from '../components/assets/icons/social.png';
import { ReloadSkeleton, PreloadImage } from "../components/waiting";

function CourseDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('tientrinh');
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(() => {
    const cachedUserData = sessionStorage.getItem('userData');
    return cachedUserData ? JSON.parse(cachedUserData) : null;
  });

  const apiKey = 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE';

  // Thêm script API YouTube chỉ một lần
  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onload = () => {
        console.log('YouTube API loaded');
      };
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!userData) return;

      try {
        const response = await fetch(`https://admin.tducoin.com/api/course/${id}/${userData.userID}`, {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Không thể lấy dữ liệu khóa học.');
        }

        const data = await response.json();
        if (data && data.data) {
          setCourse(data.data);
        } else {
          setError('Không tìm thấy khóa học.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetail();
  }, [id, userData]);

  const updateProgress = (lessonID, progress) => {
    fetch('https://admin.tducoin.com/api/course/update-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        userID: userData.userID,
        lessonID,
        progress,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setCourse((prevCourse) => {
          if (!prevCourse || !prevCourse.lessons) return prevCourse;
  
          // Cập nhật tiến độ của bài học trong state
          const updatedLessons = prevCourse.lessons.map((lesson) =>
            lesson.id === lessonID ? { ...lesson, progress } : lesson
          );
  
          // Tính lại completion của khóa học
          const totalProgress = updatedLessons.reduce((sum, lesson) => sum + lesson.progress, 0);
          const lessonCount = updatedLessons.length;
          const newCompletion = lessonCount > 0 ? Math.round(totalProgress / lessonCount) : 0;
  
          // Kiểm tra nếu completion mới là 100% và khác với giá trị trước khi cập nhật
          if (newCompletion === 100 && prevCourse.completion !== 100) {
            completeCourse();  // Gọi hàm completeCourse khi điều kiện thỏa mãn
          }
  
          return { ...prevCourse, lessons: updatedLessons, completion: newCompletion };
        });
  
        // Lấy dữ liệu từ sessionStorage
        let storedCourseData = JSON.parse(sessionStorage.getItem('courseData'));
  
        // Xử lý nếu `storedCourseData` là object nhưng có key `data` bị trùng
        if (storedCourseData && storedCourseData.data && Array.isArray(storedCourseData.data)) {
          storedCourseData = storedCourseData.data; // Lấy luôn danh sách courses, bỏ `data`
        }
  
        // Kiểm tra xem có phải object duy nhất không
        if (storedCourseData && Array.isArray(storedCourseData)) {
          // Cập nhật dữ liệu trong `storedCourseData`
          storedCourseData = storedCourseData.map((courseItem) => {
            if (courseItem.id === course?.id) {
              const updatedLessons = courseItem.lessons.map((lesson) =>
                lesson.id === lessonID ? { ...lesson, progress } : lesson
              );
  
              const totalProgress = updatedLessons.reduce((sum, l) => sum + l.progress, 0);
              const lessonCount = updatedLessons.length;
              const newCompletion = lessonCount > 0 ? Math.round(totalProgress / lessonCount) : 0;
  
              return {
                ...courseItem,
                lessons: updatedLessons,
                completion: newCompletion,
              };
            }
            return courseItem;
          });
  
          // Lưu lại vào sessionStorage (Đúng format)
          sessionStorage.setItem('courseData', JSON.stringify(storedCourseData));
        }
      } else {
        console.error('Failed to update progress:', data.message);
      }
    })
    .catch((error) => {
      console.error('Error updating progress:', error);
    });
  };
  

  const completeCourse = async () => {
    try {
      const response = await fetch('https://admin.tducoin.com/api/addbonus/course-completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          user_id: Number(userData.userID),
          course_id: Number(id),
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Cập nhật session và giao diện
        const updatedUserData = {
          ...userData,
          wallet_AC: result.wallet_AC,
          completed_courses: [...userData.completed_courses, course.id],
        };
        sessionStorage.setItem('userData', JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
      } else {
        console.error('Failed to complete course:', result.message);
      }
    } catch (error) {
      console.error('Error completing course:', error);
    }
  };

  const handleVideoPlay = (lesson) => {
    if (!lesson.lesson_link.includes('youtube.com/watch?v=')) {
      alert('Link video không hợp lệ');
      return;
    }

    const embedUrl = lesson.lesson_link.replace('watch?v=', 'embed/');
    const videoElement = document.createElement('div');
    videoElement.style.position = 'fixed';
    videoElement.style.top = 0;
    videoElement.style.left = 0;
    videoElement.style.width = '100vw';
    videoElement.style.height = '100vh';
    videoElement.style.backgroundColor = 'black';
    videoElement.style.zIndex = 1000;
    videoElement.style.display = 'flex';
    videoElement.style.alignItems = 'center';
    videoElement.style.justifyContent = 'center';

    const iframe = document.createElement('iframe');
    iframe.src = `${embedUrl}?enablejsapi=1`;
    iframe.frameBorder = '0';
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.style.width = '80%';
    iframe.style.height = '80%';
    iframe.style.borderRadius = '8px';

    const closeButton = document.createElement('button');
    closeButton.innerText = '✕';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.fontSize = '24px';
    closeButton.style.color = 'white';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';

    let player;
    let checkInterval;

    const updateAndClose = () => {
      clearInterval(checkInterval);

      if (player && player.getDuration) {
        const currentTime = player.getCurrentTime();
        const duration = player.getDuration();
        let newProgress = Math.floor((currentTime / duration) * 100);

        if (newProgress > 98) {
          newProgress = 100;
        }

        if (newProgress > (lesson.progress || 0)) {
          // Cập nhật progress ngay lập tức
          setCourse((prevCourse) => ({
            ...prevCourse,
            lessons: prevCourse.lessons.map((lessonItem) =>
              lessonItem.id === lesson.id
                ? { ...lessonItem, progress: newProgress } // Cập nhật giao diện tạm thời
                : lessonItem
            ),
          }));

          // Gọi API cập nhật progress
          updateProgress(lesson.id, newProgress);
        }
      }

      document.body.removeChild(videoElement);
    };

    closeButton.onclick = () => {
      console.log('Close button clicked');
      updateAndClose();
    };

    videoElement.appendChild(iframe);
    videoElement.appendChild(closeButton);
    document.body.appendChild(videoElement);

    const interval = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(interval);

        player = new YT.Player(iframe, {
          events: {
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                console.log('Video is playing');
                const duration = player.getDuration();

                checkInterval = setInterval(() => {
                  const currentTime = player.getCurrentTime();
                  const newProgress = Math.floor((currentTime / duration) * 100);

                  if (newProgress > (lesson.progress || 0)) {
                    console.log(`Progress updated during playback: ${newProgress}%`);
                  }
                }, 1000);
              } else if (event.data === YT.PlayerState.ENDED) {
                console.log('Video ended');
                updateAndClose();
              }
            },
          },
        });
      }
    }, 100);
  };

  const handleBack = () => {
    sessionStorage.setItem("fromCourseDetail", "true"); // Đánh dấu đến từ CourseDetail
    window.history.back();
};

  if (loading) {
    return <ReloadSkeleton />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!course) {
    return <div>Không tìm thấy khóa học</div>;
  }

  const BASE_URL = 'https://admin.tducoin.com/public/storage/';
  const picUrl = `${BASE_URL}${course.banner}`;
  const mentorUrl = `${BASE_URL}${course.mentor_avatar}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(course.title)}`;

  return (
    <div className="news-detail-container">
      <div className="banner-header">
        <button className="backIcon" onClick={handleBack}>
          <img src={backIcon} alt="Back Icon" className="backIconImage" />
        </button>
        <PreloadImage src={picUrl} alt="Banner" className="banner-image" />
        <h2 className="banner-title">{course.title}</h2>
        <div className="banner-info">
          <div className="banner-info-icon">
          <img src={mentorUrl} alt="Mentor Avatar" />
          </div>
          <span className="banner-info-text">{course.mentor}</span>
        </div>
      </div>
      <div className="news-detail-content">
        <div className="tab-menu-course">
          <div className="tab-menu">
            <button
              className={`btn_tientrinh ${activeTab === 'tientrinh' ? 'active' : ''}`}
              onClick={() => setActiveTab('tientrinh')}
            >
              Tiến trình
            </button>
            <button
              className={`btn_thaoluan ${activeTab === 'thaoluan' ? 'active' : ''}`}
              onClick={() => setActiveTab('thaoluan')}
            >
              Thảo luận
            </button>
          </div>
        </div>
        {activeTab === 'tientrinh' && (
          <div className="course-progress-container">
            {course.lessons &&
              course.lessons.map((lesson, index) => (
                <div
                  key={index}
                  className="course-step"
                  onClick={() => handleVideoPlay(lesson)}
                >
                  <div className="course-circle-container">
                    <svg className="course-circle" viewBox="0 0 36 36" width="80" height="80">
                      <path
                        className="course-circle-background"
                        d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="3"
                      />
                      <path
                        className="course-circle-progress"
                        d="M18 2.0845a15.9155 15.9155  0 1 1 0 31.831 15.9155 15.9155 0 0 1 0-31.831"
                        fill="none"
                        stroke="#4caf50"
                        strokeWidth="3"
                        strokeDasharray="100, 100"
                        strokeDashoffset={100 - lesson.progress}
                      />
                    </svg>
                    <div className="course-circle-text">
                      <div className="course-percentage">{lesson.progress}%</div>
                    </div>
                  </div>
                  <div className="course-text-container">
                    <div className="course-title">{lesson.lesson_name}</div>
                    <div className="course-description">{lesson.lesson_description}</div>
                    <div className="course-time">{lesson.lesson_duration} phút</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
