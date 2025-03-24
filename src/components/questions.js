// src/components/questions.js
import { useState, useEffect } from 'react';

/**
 * Hàm xáo trộn mảng sử dụng thuật toán Fisher-Yates
 * @param {Array} array - Mảng cần xáo trộn
 * @returns {Array} - Mảng đã được xáo trộn
 */
const shuffleArray = (array) => {
  const shuffled = [...array]; // Tạo một bản sao của mảng để không thay đổi mảng gốc
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Custom Hook để lấy và xử lý câu hỏi từ API
 * @param {string} qa_id - ID của bộ câu hỏi
 * @returns {Object} - Trả về câu hỏi, trạng thái tải và lỗi
 */
const useQuestions = (qa_id) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Hàm lấy dữ liệu câu hỏi từ API
     */
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`http://admin.tducoin.com/api/quiz/qa/${qa_id}`, {
          method: 'GET',
          headers: {
            'x-api-key': 'oqKbBxKcEn9l4IXE4EqS2sgNzXPFvE',
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.success) {
          // Định dạng dữ liệu nhận được từ API
          let formattedQuestions = data.data.map((item) => ({
            question: item.question,
            answers: [
              item.incorrectAnswer_1,
              item.incorrectAnswer_2,
              item.incorrectAnswer_3,
              item.correctAnswer,
            ],
            correctAnswer: item.correctAnswer,
          }));

          // Xáo trộn thứ tự các câu hỏi
          formattedQuestions = shuffleArray(formattedQuestions);

          // Xáo trộn thứ tự các đáp án trong mỗi câu hỏi
          formattedQuestions = formattedQuestions.map((q) => ({
            ...q,
            answers: shuffleArray(q.answers),
          }));

          setQuestions(formattedQuestions);
        } else {
          throw new Error(data.message || 'Failed to fetch questions');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (qa_id) {
      fetchQuestions();
    }
  }, [qa_id]);

  return { questions, loading, error };
};

export default useQuestions;
