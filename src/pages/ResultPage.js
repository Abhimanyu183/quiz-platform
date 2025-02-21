import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAttempts, clearAttempts } from "../utils/indexedDB"; // ✅ Fetch past attempts
import "../styles.css";

function ResultPage() {
  const [attempts, setAttempts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score || 0; // ✅ Get user's latest score

  useEffect(() => {
    async function fetchAttempts() {
      const data = await getAttempts();
      setAttempts(data.sort((a, b) => b.score - a.score)); // ✅ Sort by highest score
    }
    fetchAttempts();
  }, [score]);

  // ✅ Function to clear history with confirmation
  const handleClearHistory = async () => {
    const confirmClear = window.confirm("Are you sure you want to clear the quiz history?");
    if (confirmClear) {
      await clearAttempts();
      setAttempts([]); // ✅ Update state after clearing
    }
  };

  return (
    <div className="container">
      <h1>🎉 Quiz Completed!</h1>
      <h2>Your Score: <span className="highlight">{score}</span></h2>

      {/* ✅ Leaderboard Section */}
      <h2>🏆 Scoreboard</h2>
      {attempts.length > 0 ? (
        <ul className="leaderboard">
          {attempts.map((attempt, index) => (
            <li key={index} className="leaderboard-item">
              <span className="rank">#{index + 1}</span>
              <span className="score">{attempt.score} Points</span>
              <span className="date">
                {new Date(attempt.date).toLocaleDateString()} - {new Date(attempt.date).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No attempts recorded yet.</p>
      )}

      {/* ✅ Retry and Clear Buttons */}
      <button className="retry-btn" onClick={() => navigate("/")}>Try Again</button>
      <button className="clear-btn" onClick={handleClearHistory}>Clear History</button>
    </div>
  );
}

export default ResultPage;
