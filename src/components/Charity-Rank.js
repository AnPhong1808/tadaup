import React, { useEffect, useState } from 'react';
import './Quiz-Rank.css'; // Đảm bảo file CSS đã được thêm

function CharityRank({ charityID }) {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiKey = 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE';

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        if (!charityID) {
          throw new Error('CharityID is not provided.');
        }

        const response = await fetch(`http://admin.tducoin.com/api/charity/getUsersByCharityID/${charityID}`, {
          method: 'GET',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.data) {
          // Sắp xếp contributors theo charity_amount giảm dần và giới hạn 10 người đầu tiên
          const sortedContributors = data.data
            .sort((a, b) => b.charity_amount - a.charity_amount) // Sắp xếp giảm dần
            .slice(0, 10); // Lấy 10 người đầu tiên
          setContributors(sortedContributors);
        } else {
          throw new Error('Invalid API response structure.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, [charityID]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  if (!contributors || contributors.length === 0) {
    return <div>Chưa có thông tin quyên góp nào.</div>;
  }

  const BASE_URL = "http://admin.tducoin.com/public/storage/";

  return (
    <div className="card-container">
      {contributors.map((contributor, index) => (
        <div key={contributor.id}>
          <div className="card-row">
            <div className="left-section">
              <div className="rank">#{index + 1}</div>
              <div className="quizrank-circle">
                <img
                  src={`${BASE_URL}${contributor.user.avatar}` || '/default-avatar.png'}
                  alt={`Avatar ${index + 1}`}
                  className="avatar-image"
                />
              </div>
              <div className="rank-name">{contributor.user.name}</div>
            </div>
            <div className="rank-time">{contributor.charity_amount || 'N/A'}</div>
          </div>
          {index < contributors.length - 1 && <div className="card-divider"></div>}
        </div>
      ))}
    </div>
  );
}

export default CharityRank;
