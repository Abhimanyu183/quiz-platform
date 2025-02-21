import { useNavigate } from "react-router-dom";
import "../styles.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">🎯 Welcome to the Ultimate Quiz Challenge!</h1>
      <p className="home-description">
        Test your knowledge, challenge yourself, and track your progress. Are you ready to begin?
      </p>
      <button className="start-btn" onClick={() => navigate("/quiz")}>
        🚀 Start Quiz
      </button>
    </div>
  );
}

export default Home;
