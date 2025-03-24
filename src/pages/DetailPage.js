import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const quizData = [
  // ... dữ liệu quiz
];
const newsData = [
  // ... dữ liệu tin tức
];

function DetailPage() {
  const { id, dataType } = useParams(); // Lấy id và dataType từ URL
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    let selectedDetail = null;
    if (dataType === 'USDT' || dataType === 'TDU') {
      selectedDetail = quizData.find(item => item.id.toString() === id);
    } else {
      selectedDetail = newsData.find(item => item.id.toString() === id);
    }
    setDetail(selectedDetail);
  }, [id, dataType]);

  if (!detail) return <div>Loading...</div>;

  return (
    <div className="detail-page">
      <h2>{detail.title}</h2>
      <img src={detail.pic} alt={detail.title} />
      <p>{detail.description}</p>
      {/* Hiển thị thông tin chi tiết khác nếu cần */}
    </div>
  );
}

export default DetailPage;
