import React from 'react';
import { useNavigate } from 'react-router-dom';
import nextIcon from '../components/assets/icons/next.png';
import "./Setting-Menu.css";
import "./Setting-Format.css";

function About({ onBack }) {
  return (
    <div className="menu-container">
      
      <h2 className="setting-format-title">
        Welcome to <span className="setting-format-highlight">TadaUp</span>
      </h2>
      
      <p className="setting-format-description">
        TadaUp is a revolutionary fintech platform that combines 
        <strong> CopyTrade</strong>, <strong>Follow Signal</strong>, and an advanced 
        <strong> AI-powered capital management system</strong> to deliver efficient 
        and intelligent financial trading solutions. Whether you're a beginner or 
        an experienced trader, TadaUp empowers you to optimize your investment 
        strategies and maximize profitability.
      </p>

      <div className="setting-format-section">
        <h3 className="setting-format-subtitle">Key Features</h3>
        <ul className="setting-format-list">
          <li>
            <strong>CopyTrade & Follow Signal</strong>: Automatically replicate 
            the trades of top-performing investors or follow expert trading signals 
            in real-time.
          </li>
          <li>
            <strong>AI-Powered Capital Management</strong>: Our smart bots analyze 
            market trends, assess risks, and manage your capital allocation for optimal performance.
          </li>
          <li>
            <strong>Comprehensive Financial News</strong>: Stay updated with the latest 
            market trends, economic developments, and industry insights.
          </li>
          <li>
            <strong>Financial Games & Knowledge Challenges</strong>: Enhance your trading 
            skills and financial literacy through interactive games and quizzes.
          </li>
          <li>
            <strong>Charity Donations</strong>: Contribute to meaningful causes by 
            donating a portion of your earnings directly through the platform.
          </li>
        </ul>
      </div>

      <div className="setting-format-section">
        <h3 className="setting-format-subtitle">Why Choose TadaUp?</h3>
        <ul className="setting-format-list">
          <li>
            <strong>User-Friendly Interface</strong>: Designed for ease of use, TadaUp 
            is suitable for traders of all experience levels.
          </li>
          <li>
            <strong>Advanced Technology</strong>: Leverage the power of AI and machine 
            learning for precise and efficient trading.
          </li>
          <li>
            <strong>Community-Driven</strong>: Connect with a global network of traders, 
            share strategies, and learn from experts.
          </li>
          <li>
            <strong>Holistic Approach</strong>: Beyond trading, TadaUp offers educational 
            resources, entertainment, and opportunities for social impact.
          </li>
        </ul>
      </div>

      <div className="setting-format-section">
        <h4 className="setting-format-subtitle">Join TadaUp Today!</h4>
        <p className="setting-format-description">
          TadaUp is more than just a trading platform—it's a comprehensive ecosystem 
          that combines technology, education, and community to redefine the future 
          of fintech. Whether you're looking to grow your wealth, enhance your 
          trading skills, or contribute to a greater cause, TadaUp is your ultimate 
          partner in the world of finance.
        </p>
      </div>

    </div>
  );
}

export default About;
