// src/components/QuizStarting.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import useQuestions from '../components/questions'; // Import custom Hook
import coinIcon from '../components/assets/icons/coin-header.png'; // Import icon coin
import './QuizStarting.css'; // Import CSS
import ResultCard from '../components/ResultCard'; // Import ResultCard component

// Import âm thanh
import correctSound from '../components/assets/sounds/correct-answer.mp3';
import incorrectSound from '../components/assets/sounds/incorrect-answer.mp3';

const QuizStarting = () => {
  const { id } = useParams(); // Lấy quiz.id từ URL
  const [quiz] = useSearchParams(); // Lấy tham số từ URL
  const collection_id = quiz.get('collection_id'); // Lấy collection_id từ URL
  const { questions, loading, error } = useQuestions(collection_id); // Gọi custom Hook với collection_id

  const [selectedAnswer, setSelectedAnswer] = useState(null); // Đáp án được chọn
  const [questionNumber, setQuestionNumber] = useState(0); // Câu hỏi hiện tại (index)
  const [isCorrect, setIsCorrect] = useState(null); // Kết quả đúng/sai
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái đã kiểm tra
  const [quizCompleted, setQuizCompleted] = useState(false); // Trạng thái hoàn thành bài thi
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // Số câu đúng
  const [timer, setTimer] = useState(0); // Tổng thời gian (ms)
  const timerRef = useRef(null); // Dùng để lưu tham chiếu đến interval

  // Hiệu ứng âm thanh
  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  // Hàm khởi động đồng hồ
  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 10); // Cộng thêm 10ms mỗi lần
      }, 10);
    }
  };

  // Hàm tạm dừng đồng hồ
  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Hàm định dạng thời gian
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((time % 60000) / 1000)).padStart(2, '0');
    const milliseconds = String(time % 1000).padStart(3, '0');
    return `${minutes} : ${seconds} : ${milliseconds}`;
  };

  useEffect(() => {
    if (isSubmitted) {
      if (isCorrect) {
        playSound(correctSound);
        setCorrectAnswersCount((prev) => prev + 1); // Tăng số câu đúng khi đúng
      } else {
        playSound(incorrectSound);
        // Hiệu ứng rung
        if ('vibrate' in navigator) {
          navigator.vibrate(300); // Rung trong 300ms
        }
      }
    }
  }, [isSubmitted]);

  const handleAnswerClick = (answer) => {
    if (!isSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!isSubmitted) {
      pauseTimer();
      const correctAnswer = questions[questionNumber].correctAnswer;
      const result = selectedAnswer === correctAnswer;
      setIsCorrect(result);
      setIsSubmitted(true);

      if (questionNumber === questions.length - 1) {
        setQuizCompleted(true);
      }
    } else {
      if (questionNumber < questions.length - 1) {
        setQuestionNumber((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setIsSubmitted(false);
        startTimer();
      } else {
        pauseTimer();
        setQuizCompleted(true);
      }
    }
  };

  useEffect(() => {
    startTimer();
    return () => pauseTimer();
  }, []);

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="quizstarting-container">
      {/* Header */}
      <div className="quizstarting-header">
        <div className="quizstarting-score-container">
          <div className="quizstarting-score">
            <img src={coinIcon} alt="Coin Icon" className="quizstarting-coin-icon" />
            <span>1000</span> {/* Đây là điểm số */}
          </div>
        </div>
        <div className="quizstarting-question-number">
          Câu {questionNumber + 1} trên tổng {questions.length} câu
        </div>
      </div>
      <div className="quizstarting-timer-container">
        <div className="quizstarting-timer">{formatTime(timer)}</div>
      </div>

      {/* Question */}
      <div className="quizstarting-question">
        <h2>{questions[questionNumber].question}</h2>
        <p>Hãy chọn một câu trả lời:</p>
      </div>

      {/* Answers */}
      <div className="quizstarting-answers">
        {questions[questionNumber].answers.map((answer, index) => (
          <div
            key={index}
            className={`quizstarting-answer 
              ${selectedAnswer === answer ? 'selected' : ''} 
              ${isSubmitted && answer === questions[questionNumber].correctAnswer ? 'correct' : ''} 
              ${isSubmitted && selectedAnswer === answer && selectedAnswer !== questions[questionNumber].correctAnswer ? 'incorrect' : ''}`}
            onClick={() => handleAnswerClick(answer)}
          >
            {answer}
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <button
        className={`quizstarting-submit-button ${isSubmitted ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
        onClick={handleSubmit}
        disabled={!selectedAnswer && !isSubmitted}
      >
        {isSubmitted ? 'Tiếp tục' : 'Kiểm tra'}
      </button>

      {/* Hiển thị ResultCard sau khi bài thi hoàn thành */}
      {quizCompleted && (
        <div className="quizstarting-result-card">
          <ResultCard
            quiz_id={id}
            score={timer} // Truyền thời gian dưới dạng số (ms)
            correctAnswers={correctAnswersCount} // Truyền số câu đúng vào ResultCard
            totalQuestions={questions.length}
          />
        </div>
      )}
    </div>
  );
};

export default QuizStarting;
