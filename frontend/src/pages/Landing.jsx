import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="home-page-cricket" style={{ minHeight: "100vh", paddingTop: 120 }}>
      <header style={{ textAlign: "center", marginBottom: 40 }}>
        <h1>🏏 CricketZone</h1>
        <p>Your landing page — explore or sign in to access full features</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 16 }}>
          <button onClick={() => navigate("/auth?mode=login")}>Sign In</button>
          <button onClick={() => navigate("/auth?mode=signup")}>Join Now</button>
          <button onClick={() => navigate("/home")}>Go to Home</button>
        </div>
      </header>

      <section style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
        <h2>Highlights</h2>
        <ul>
          <li>Live Scores</li>
          <li>Live Streams</li>
          <li>AI Chatbot (requires sign in)</li>
          <li>Cricket History</li>
        </ul>
      </section>
    </div>
  );
}