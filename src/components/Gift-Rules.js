import React from 'react';
import './Quiz-Rules.css'; // Đảm bảo đã thêm CSS cho phần tử
import supportIcon from '../components/assets/icons/support.png'; // Đảm bảo đường dẫn đúng
import nextIcon from '../components/assets/icons/next.png'; // Đảm bảo đường dẫn đúng

function GiftRules({ rules }) {
  // Kiểm tra và chuyển đổi rules
  let parsedRules = [];
  try {
    if (typeof rules === 'string') {
      // Loại bỏ ký tự escape nếu có
      const sanitizedRules = rules.replace(/\\\\/g, '\\').replace(/\\"/g, '"');
      parsedRules = JSON.parse(sanitizedRules);
    } else if (Array.isArray(rules)) {
      parsedRules = rules;
    } else {
      console.error('Rules không đúng định dạng. Vui lòng kiểm tra lại.');
    }
  } catch (error) {
    console.error('Lỗi phân tích JSON của rules:', error);
  }

  return (
    <div className="card-container">
      {/* Tiêu đề */}
      <div className="card-title">Rules for redeeming and using rewards</div>
      <div className="card-divider"></div>
      {/* Danh sách luật */}
      <div className="rules-list">
        {Array.isArray(parsedRules) && parsedRules.length > 0 ? (
          parsedRules.map((rule, index) => (
            <div className="rule-item" key={rule.rule_id || index}>
              <div className="rule-index">{index + 1}</div>
              <div className="rule-text">{rule.description}</div>
            </div>
          ))
        ) : (
          <div className="no-rules">[Don't any rules here.]</div>
        )}
      </div>
      {/* Đường phân chia */}
      <div className="card-divider"></div>
      {/* Phần Button */}
      <div className="card-buttons">
        <button
          className="card-button"
          onClick={() =>
            window.location.href = 'https://t.me/tadaupsupport'
          }
        >
          <img src={supportIcon} alt="icon" className="ideas-icon" />
          <span>Liên hệ hỗ trợ</span>
          <img src={nextIcon} alt="arrow" className="arrow-icon" />
        </button>
      </div>
    </div>
  );
}

export default GiftRules;
