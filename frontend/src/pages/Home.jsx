import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/HomePage.css";

export default function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [liveMatches, setLiveMatches] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);

  const API = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    fetchMatches();
    fetchStreams();
  }, []);

  async function fetchMatches() {
    try {
      const res = await fetch(`${API}/api/cricket/matches/`);
      if (!res.ok) throw new Error("no api");
      const data = await res.json();
      setLiveMatches(data);
    } catch {
      setLiveMatches([
        { id: 1, team1: "India", team2: "Pakistan", score: "156/4", overs: "18.2/20", format: "T20" },
      ]);
    }
  }

  async function fetchStreams() {
    try {
      const res = await fetch(`${API}/api/cricket/streams/`);
      if (!res.ok) throw new Error("no api");
      const data = await res.json();
      setLiveStreams(data);
    } catch {
      setLiveStreams([{ id: 1, title: "IND vs PAK - Live", platform: "YouTube", link: "#" }]);
    }
  }

  async function handleChatSubmit(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!isAuthenticated) {
      navigate("/auth?mode=login");
      return;
    }

    const message = { id: Date.now(), text: chatInput, sender: "user" };
    setChatMessages((p) => [...p, message]);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/chatbot/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: chatInput }),
      });
      const data = await (res.ok ? res.json() : Promise.reject("bot api failed"));
      const botText = data?.reply || data?.message || "No reply";
      setChatMessages((p) => [...p, { id: Date.now() + 1, text: botText, sender: "bot" }]);
    } catch {
      setChatMessages((p) => [...p, { id: Date.now() + 1, text: "Bot unavailable. Try later.", sender: "bot" }]);
    } finally {
      setChatInput("");
      setShowChat(true);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/");
  }

  return (
    <div className="home-page-cricket">
      <nav className="top-nav-cricket">
        <div className="nav-content-cricket">
          <div className="nav-logo-cricket">🏏 CricketZone</div>
          <div className="nav-links-cricket">
            <button onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}>Live Scores</button>
            <button onClick={() => window.scrollTo({ top: 1100, behavior: "smooth" })}>Live Streams</button>
            <button onClick={() => window.scrollTo({ top: 1800, behavior: "smooth" })}>History</button>
          </div>
          <div className="nav-user-cricket">
            {isAuthenticated ? (
              <>
                <span className="user-greeting-cricket">👋 {user?.first_name || user?.username}</span>
                <button className="logout-btn-cricket" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button className="nav-signin-btn-cricket" onClick={() => navigate("/auth?mode=login")}>Sign In</button>
                <button className="nav-signup-btn-cricket" onClick={() => navigate("/auth?mode=signup")}>Join Now</button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main style={{ paddingTop: 120 }}>
        <section className="main-content-section-cricket">
          <h2>🔴 LIVE CRICKET SCORES</h2>
          <div className="matches-grid-cricket">
            {liveMatches.map((m) => (
              <div key={m.id} className="match-card-cricket">
                <div className="match-header-cricket">
                  <span className="live-badge-cricket">● LIVE</span>
                  <span className="format-badge-cricket">{m.format || "T20"}</span>
                </div>
                <div className="match-teams-cricket">
                  <div className="team-info-cricket">
                    <h3>{m.team1}</h3>
                    <p className="score-cricket">{m.score || m.team1Score}</p>
                  </div>
                  <div className="match-divider-cricket">VS</div>
                  <div className="team-info-cricket">
                    <h3>{m.team2}</h3>
                    <p className="score-cricket">{m.team2Score || "-"}</p>
                  </div>
                </div>
                <p>Overs: {m.overs}</p>
                <button className="view-details-btn-cricket">View Full Scorecard →</button>
              </div>
            ))}
          </div>
        </section>

        <section id="streams" style={{ marginTop: 60 }}>
          <h2>📺 LIVE STREAMS</h2>
          <div className="streams-grid-cricket">
            {liveStreams.map((s) => (
              <div key={s.id} className="stream-card-cricket">
                <div className="stream-thumbnail-cricket"><span className="stream-icon-cricket">🎥</span></div>
                <div className="stream-info-cricket">
                  <h3>{s.title}</h3>
                  <div className="stream-meta-cricket"><span>{s.platform}</span></div>
                  <a className="watch-stream-btn-cricket" href={s.link || "#"} target="_blank" rel="noreferrer">Watch Now 🎬</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="history" style={{ marginTop: 60 }}>
          <h2>📚 CRICKET HISTORY</h2>
          <div className="history-timeline-cricket">
            <div className="history-card-cricket left">
              <div className="history-icon-cricket">🏆</div>
              <div className="history-content-cricket">
                <span className="history-year-cricket">2011</span>
                <h3>India wins ICC World Cup</h3>
                <p>MS Dhoni seals it with a six at Wankhede.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className={`chatbot-widget-cricket ${showChat ? "active" : ""}`}>
        {isAuthenticated ? (
          <>
            <div className="chatbot-header-cricket">
              <h3>🤖 Cricket Bot</h3>
              <button className="close-chat-btn-cricket" onClick={() => setShowChat(false)}>✕</button>
            </div>
            <div className="chatbot-messages-cricket">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-message-cricket ${msg.sender}`}>
                  <div className="message-content-cricket">{msg.text}</div>
                </div>
              ))}
            </div>
            <form className="chatbot-form-cricket" onSubmit={handleChatSubmit}>
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about players, matches, streams..." />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="chatbot-signin-required-cricket">
            <div className="signin-icon-cricket">🔒</div>
            <h3>Sign In to use the Cricket Bot</h3>
            <button onClick={() => navigate("/auth?mode=login")}>Sign In</button>
            <button onClick={() => navigate("/auth?mode=signup")}>Create Account</button>
          </div>
        )}
      </div>

      <button className="chat-toggle-btn-cricket" onClick={() => setShowChat(true)}>💬</button>
    </div>
  );
}