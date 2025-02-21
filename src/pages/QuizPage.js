import React, { useState, useEffect } from "react";
import questions from "../components/Question";  
import { saveAttempt, getAttempts } from "../utils/indexedDB";  
import "../styles.css";

function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizOver, setQuizOver] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [feedback, setFeedback] = useState(""); // ✅ Instant feedback

  useEffect(() => {
    async function fetchAttempts() {
      const data = await getAttempts();
      setAttempts(data);
    }
    fetchAttempts();
  }, [quizOver]);

  // ✅ Timer: Resets for each question, exits only on last question timeout
  useEffect(() => {
    if (quizOver) return;
    if (timeLeft === 0) {
      handleTimeOut();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quizOver]);

  const handleAnswer = async (answer) => {
    if (quizOver || selectedAnswer) return; // ✅ Prevent multiple selections

    setSelectedAnswer(answer);
    
    if (answer === questions[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("✅ Correct!");
      
      setTimeout(() => {
        setFeedback("");
        setSelectedAnswer(null);
        if (currentQuestion + 1 < questions.length) {
          setCurrentQuestion((prev) => prev + 1);
          setTimeLeft(30); // ✅ Reset timer for next question
        } else {
          saveAndEndQuiz(score + 1);
        }
      }, 1000);
    } else {
      setFeedback("❌ Incorrect! Game Over.");
      setTimeout(() => {
        saveAndEndQuiz(score);
      }, 1000);
    }
  };

  const handleTimeOut = async () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30); // ✅ Move to the next question if not the last one
    } else {
      alert(`⏳ Time's up! Your final score: ${score}`);
      await saveAndEndQuiz(score); // ✅ Exit only if it's the last question
    }
  };

  const saveAndEndQuiz = async (finalScore) => {
    await saveAttempt(finalScore);
    setQuizOver(true);
  };

  if (quizOver) {
    return (
      <div className="container">
        <h1>🎉 Game Over!</h1>
        <h2>Your Final Score: <span className="highlight">{score}</span></h2>

        {/* ✅ Show past attempts */}
        <h2>🏆 Leaderboard</h2>
        {attempts.length > 0 ? (
          <ul className="leaderboard">
            {attempts.map((attempt, index) => (
              <li key={index} className="leaderboard-item">
                <span className="rank">#{index + 1}</span>
                <span className="score">{attempt.score} Points</span>
                <span className="date">{new Date(attempt.date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No previous attempts recorded.</p>
        )}

        <button className="retry-btn" onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Quiz</h1>
      <p>Question {currentQuestion + 1} / {questions.length}</p>

      {/* ✅ Timer Display */}
      <p>⏳ Time Left: <span className="highlight">{timeLeft}s</span></p>
      <div className="timer-bar" style={{ width: `${(timeLeft / 30) * 100}%` }}></div>

      <h2>{questions[currentQuestion].question}</h2>

      {/* ✅ Show feedback */}
      {feedback && <p className="feedback">{feedback}</p>}

      <div className="quiz-options">
        {questions[currentQuestion].options.map((option, index) => (
          <div 
            key={index} 
            className={`option ${selectedAnswer === option ? 
              (option === questions[currentQuestion].answer ? "correct" : "incorrect") 
              : ""}`} 
            onClick={() => handleAnswer(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizPage;
