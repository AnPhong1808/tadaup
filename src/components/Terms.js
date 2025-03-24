import React from 'react';
import { useNavigate } from 'react-router-dom';
import nextIcon from '../components/assets/icons/next.png';
import "./Setting-Menu.css";
import "./Setting-Format.css";

function Terms({ onBack }) {
  return (
    <div className="menu-container">
      
      <h2 className="setting-format-title">
        Terms & Conditions of <span className="setting-format-highlight">TadaUp</span>
      </h2>
      
      <p className="setting-format-description">
        Welcome to <strong>TadaUp</strong>, a cutting-edge fintech platform that provides 
        advanced trading solutions, including <strong>CopyTrade</strong>, 
        <strong>Follow Signal</strong>, and an AI-powered capital management system. 
        By using our services, you agree to abide by the following terms and conditions.
      </p>

      <div className="setting-format-section">
        <h3 className="setting-format-subtitle">1. Account Registration</h3>
        <ul className="setting-format-list">
          <li>
            Users must be at least <strong>18 years old</strong> or meet the legal 
            trading age in their country.
          </li>
          <li>
            By registering, users agree to provide <strong>accurate and up-to-date information</strong>.
          </li>
          <li>
            Users are responsible for maintaining the security of their accounts and passwords.
          </li>
          <li>
            Any unauthorized activity must be reported to TadaUp immediately.
          </li>
        </ul>
      </div>

      <div className="setting-format-section">
        <h3 className="setting-format-subtitle">2. Financial Transactions</h3>
        <ul className="setting-format-list">
          <li>
            All transactions, including deposits and withdrawals, must comply with 
            <strong>anti-money laundering (AML) and Know Your Customer (KYC) regulations</strong>.
          </li>
          <li>
            TadaUp is not responsible for any <strong>losses due to market volatility</strong>, 
            incorrect transactions, or third-party services.
          </li>
          <li>
            Fees and commissions may apply to specific services and will be displayed 
            before transactions.
          </li>
        </ul>
      </div>

      <div className="setting-format-section">
        <h3 className="setting-format-subtitle">3. Risk Disclaimer</h3>
        <ul className="setting-format-list">
          <li>
            Trading involves <strong>high financial risk</strong>. Users should conduct 
            independent research before making investment decisions.
          </li>
          <li>
            TadaUp does not provide <strong>financial advice</strong>. All decisions 
            made by users are their own responsibility.
          </li>
          <li>
            Past performance of traders or AI strategies does not guarantee future results.
          </li>
        </ul>
      </div>

      <div className="setting-format-section">
        <h3 className="setting-format-subtitle">4. Prohibited Activities</h3>
        <ul className="setting-format-list">
          <li>
            Users must not engage in <strong>fraudulent, abusive, or illegal activities</strong> 
            using the TadaUp platform.
          </li>
          <li>
            Market manipulation, unauthorized bot usage, and hacking attempts are strictly prohibited.
          </li>
          <li>
            Violations of these terms may result in <strong>account suspension or legal action</strong>.
          </li>
        </ul>
      </div>

      <div className="setting-format-section">
        <h3 className="setting-format-subtitle">5. Privacy & Data Protection</h3>
        <ul className="setting-format-list">
          <li>
            TadaUp values <strong>user privacy</strong> and complies with data protection laws.
          </li>
          <li>
            User data will not be shared with third parties without consent, except as required by law.
          </li>
          <li>
            By using our platform, users agree to the collection of necessary data for security and service improvement.
          </li>
        </ul>
      </div>

      <div className="setting-format-section">
        <h3 className="setting-format-subtitle">6. Updates to Terms</h3>
        <ul className="setting-format-list">
          <li>
            TadaUp reserves the right to update these terms <strong>at any time</strong>.
          </li>
          <li>
            Users will be notified of significant changes through email or platform announcements.
          </li>
          <li>
            Continued use of the platform after updates indicates acceptance of the new terms.
          </li>
        </ul>
      </div>

      <div className="setting-format-section">
        <h4 className="setting-format-subtitle">Acceptance of Terms</h4>
        <p className="setting-format-description">
          By accessing and using TadaUp, you confirm that you have read, understood, 
          and agreed to these terms and conditions. If you do not agree, please 
          discontinue the use of our services.
        </p>
      </div>

    </div>
  );
}

export default Terms;
