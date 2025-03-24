// TelegramNotification.js
import React from 'react';

const token = '8032885107:AAEjNWGp7v2n7ZH78Oy6cCCWHGiCMIzB2xU'; // Bot An An là AI
const url = `https://api.telegram.org/bot${token}/sendMessage`;
const main_token = '7458768044:AAG-LvoaLQhn8VMgCY1ZCtnq099gMvfEnW4'; // Bot TadaUp Global
const main_url = `https://api.telegram.org/bot${main_token}/sendMessage`;
const tadaserver1_token = '8163530036:AAEENvidwbwQXiCRgMxb676jtUthDbQyL6k';
const tadaserver1_url = `https://api.telegram.org/bot${tadaserver1_token}/sendMessage`;

const adminId = '6461541179'; // ID của admin Telegram
const tadaserver1_Id = '-4681087391'; // ID của hứng tin từ bot tadaserver1
const adminId_group = '-1002452212906' // ID nhóm quản lý

// Hàm gửi tin nhắn đến Telegram
export const sendTelegramMessage = async (message) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminId,
        text: message, // Nội dung tin nhắn
      }),
    });

    if (!response.ok) {
      console.error('Failed to send message to admin');
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

// Hàm gửi controller đến VPS
export const sendTadaServer1Message = async (message) => {
  try {
    const response = await fetch(tadaserver1_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: tadaserver1_Id,
        text: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send message to tadaserver1:', errorData);
    } else {
      console.log('Message sent to chat successfully');
    }
  } catch (error) {
    console.error('Error sending message to tadaserver1:', error);
  }
};

// Hàm gửi tin nhắn đến Telegram
export const sendSignal = async (message, groupId) => {
  // Kiểm tra nếu groupId không tồn tại, sử dụng adminId
  const targetId = groupId || adminId;

  try {
    const response = await fetch(main_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: targetId,
        text: message, // Nội dung tin nhắn
      }),
    });

    if (!response.ok) {
      console.error('Failed to send message to admin');
    }
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
  }
};

// Hàm gửi Inline Keyboard
export const sendInlineKeyboard = async (text, buttonText, callbackData) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: adminId_group,
        text: text,
        reply_markup: {
          inline_keyboard: [
            [{ text: buttonText, callback_data: callbackData }]
          ]
        }
      }),
    });

    if (response.ok) {
      console.log('Inline Keyboard sent successfully');
    } else {
      console.error('Failed to send Inline Keyboard');
    }
  } catch (error) {
    console.error('Error sending Inline Keyboard:', error);
  }
};

const TelegramNotification = ({ message, inlineText, buttonText, callbackData }) => {
  React.useEffect(() => {
    if (message) {
      sendTelegramMessage(message);
    }
    if (inlineText && buttonText && callbackData) {
      sendInlineKeyboard(inlineText, buttonText, callbackData);
    }
  }, [message, inlineText, buttonText, callbackData]);

  return null;
};

export default TelegramNotification;
