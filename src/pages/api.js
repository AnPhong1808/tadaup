// api.js
const API_BASE_URL = "https://admin.tducoin.com/api";

const fetchData = async (url, apiKey, method = "GET") => {
  try {
    console.log("fetchData - Sending request to:", url, "with apiKey:", apiKey); // Log để debug
    const response = await fetch(url, {
      method,
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text(); // Lấy nội dung lỗi từ response
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
    }

    const data = await response.json();
    console.log("fetchData - Response:", data); // Log để debug
    return data;
  } catch (err) {
    console.error(`fetchData - Error fetching ${url}:`, err.message);
    return null; // Trả về null thay vì {} để dễ xử lý lỗi
  }
};

// Tải dữ liệu ban đầu (gộp tất cả)
export const preloadData = async (apiKey, userId, page = 1, limit = 10, doneAt = null, dataType = null) => {
  try {
    const url = `${API_BASE_URL}/tradingbot/start?page=${page}&limit=${limit}${doneAt ? `&done_at=${doneAt}` : ''}&user_id=${userId}${dataType ? `&dataType=${dataType}` : ''}`;
    const data = await fetchData(url, apiKey);
    return {
      signalData: data?.data?.signalData || [],
      signalHasMore: data?.meta?.signalData?.hasMore || false,
      resultData: data?.data?.resultData || [],
      resultHasMore: data?.meta?.resultData?.hasMore || false,
      channelData: data?.data?.channelData || [],
      channelHasMore: data?.meta?.channelData?.hasMore || false,
      quizData: data?.data?.quizData || [],
      quizHasMore: data?.meta?.quizData?.hasMore || false,
      newsData: data?.data?.newsData || [],
      newsHasMore: data?.meta?.newsData?.hasMore || false,
      userData: data?.data?.userData || {},
      courseData: data?.data?.courseData || [],
      courseHasMore: data?.meta?.courseData?.hasMore || false,
      charityData: data?.data?.charityData || [],
      charityHasMore: data?.meta?.charityData?.hasMore || false,
      giftData: data?.data?.giftData || [],
      giftHasMore: data?.meta?.giftData?.hasMore || false,
    };
  } catch (error) {
    console.error("Error during preloadData:", error);
    return {
      signalData: [],
      signalHasMore: false,
      resultData: [],
      resultHasMore: false,
      channelData: [],
      channelHasMore: false,
      quizData: [],
      quizHasMore: false,
      newsData: [],
      newsHasMore: false,
      userData: {},
      courseData: [],
      courseHasMore: false,
      charityData: [],
      charityHasMore: false,
      giftData: [],
      giftHasMore: false,
    };
  }
};

// Tải thêm Signals
export const fetchMoreSignals = async (apiKey, page = 1, limit = 10, doneAt = null) => {
  const url = `${API_BASE_URL}/signal?page=${page}&limit=${limit}${doneAt ? `&done_at=${doneAt}` : ''}`;
  const data = await fetchData(url, apiKey);
  return {
    signalData: data?.data || [],
    signalHasMore: data?.meta?.hasMore || false,
  };
};

// Tải thêm Channels
export const fetchMoreChannels = async (apiKey, page = 1, limit = 10) => {
  const url = `${API_BASE_URL}/signal/channel?page=${page}&limit=${limit}`;
  const data = await fetchData(url, apiKey);
  return {
    channelData: data?.data || [],
    channelHasMore: data?.meta?.hasMore || false,
  };
};

// Tải thêm Quiz
export const fetchMoreQuiz = async (apiKey, page = 1, limit = 10) => {
  const url = `${API_BASE_URL}/quiz?page=${page}&limit=${limit}`;
  const data = await fetchData(url, apiKey);
  return {
    quizData: data?.data || [],
    quizHasMore: data?.meta?.hasMore || false,
  };
};

export const fetchMoreNews = async (apiKey, page = 1, limit = 10, dataType = null) => {
  try {
    const url = `${API_BASE_URL}/news?page=${page}&limit=${limit}${dataType ? `&dataType=${dataType}` : ''}`;
    const data = await fetchData(url, apiKey);
    
    if (!data || !data.data || typeof data.meta?.hasMore !== "boolean") {
      console.error("fetchMoreNews - Invalid data structure:", data);
      return {
        newsData: [],
        newsHasMore: false,
      };
    }

    return {
      newsData: data.data,
      newsHasMore: data.meta.hasMore,
    };
  } catch (error) {
    console.error("fetchMoreNews - Failed to fetch:", error.message);
    return {
      newsData: [],
      newsHasMore: false,
    };
  }
};

export const fetchMoreCourses = async (apiKey, userId, page = 1, limit = 10) => {
  try {
    const url = `${API_BASE_URL}/courses/${userId}?page=${page}&limit=${limit}`;
    const data = await fetchData(url, apiKey);

    if (!data || !data.data || typeof data.meta?.hasMore !== "boolean") {
      console.error("fetchMoreCourses - Invalid data structure:", data);
      return {
        data: [],
        meta: { hasMore: false },
      };
    }

    return {
      data: data.data,
      meta: { hasMore: data.meta.hasMore },
    };
  } catch (error) {
    console.error("fetchMoreCourses - Failed to fetch:", error.message);
    return {
      data: [],
      meta: { hasMore: false },
    };
  }
};

// Tải thêm Charity
export const fetchMoreCharity = async (apiKey, page = 1, limit = 10) => {
  const url = `${API_BASE_URL}/charity?page=${page}&limit=${limit}`;
  const data = await fetchData(url, apiKey);
  return {
    charityData: data?.data || [],
    charityHasMore: data?.meta?.hasMore || false,
  };
};

// Tải thêm Gift
export const fetchMoreGifts = async (apiKey, page = 1, limit = 10) => {
  const url = `${API_BASE_URL}/gift?page=${page}&limit=${limit}`;
  const data = await fetchData(url, apiKey);
  return {
    giftData: data?.data || [],
    giftHasMore: data?.meta?.hasMore || false,
  };
};