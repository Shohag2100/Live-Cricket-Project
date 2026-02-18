// filepath: /home/shohag/Desktop/cricket_website/frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// filepath: /home/shohag/Desktop/cricket_website/frontend/src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("scores");
  const [liveMatches, setLiveMatches] = useState([]);
  const [liveStreams, setLiveStreams] = useState([]);
  const [cricketHistory, setCricketHistory] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! Welcome to CricketZone. Ask me anything about cricket!", sender: "bot" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    document.title = "CricketZone — Home";
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }

    fetchLiveMatches();
    fetchLiveStreams();
    fetchCricketHistory();
  }, []);

  const fetchLiveMatches = () => {
    const mockMatches = [
      {
        id: 1,
        team1: "India",
        team1Flag: "🇮🇳",
        team2: "Pakistan",
        team2Flag: "🇵🇰",
        team1Score: "156/4",
        team2Score: "145",
        overs: "18.2/20",
        status: "LIVE",
        format: "T20",
        venue: "Wankhede Stadium, Mumbai"
      },
      {
        id: 2,
        team1: "Australia",
        team1Flag: "🇦🇺",
        team2: "New Zealand",
        team2Flag: "🇳🇿",
        team1Score: "298/7",
        team2Score: "0/0",
        overs: "50/50",
        status: "LIVE",
        format: "ODI",
        venue: "MCG, Melbourne"
      },
      {
        id: 3,
        team1: "England",
        team1Flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        team2: "West Indies",
        team2Flag: "🇯🇲",
        team1Score: "425",
        team2Score: "387/9",
        overs: "90/90",
        status: "LIVE",
        format: "Test",
        venue: "Lord's, London"
      },
      {
        id: 4,
        team1: "South Africa",
        team1Flag: "🇿🇦",
        team2: "Sri Lanka",
        team2Flag: "🇱🇰",
        team1Score: "178/6",
        team2Score: "142",
        overs: "19.3/20",
        status: "LIVE",
        format: "T20",
        venue: "Newlands, Cape Town"
      },
      {
        id: 5,
        team1: "Bangladesh",
        team1Flag: "🇧🇩",
        team2: "Afghanistan",
        team2Flag: "🇦🇫",
        team1Score: "245/8",
        team2Score: "189",
        overs: "48.5/50",
        status: "LIVE",
        format: "ODI",
        venue: "Mirpur, Dhaka"
      },
      {
        id: 6,
        team1: "Ireland",
        team1Flag: "🇮🇪",
        team2: "Zimbabwe",
        team2Flag: "🇿🇼",
        team1Score: "134/5",
        team2Score: "128",
        overs: "16.4/20",
        status: "LIVE",
        format: "T20",
        venue: "Dublin"
      }
    ];
    setLiveMatches(mockMatches);
  };

  const fetchLiveStreams = () => {
    const mockStreams = [
      {
        id: 1,
        title: "IND vs PAK - T20 World Cup Final",
        thumbnail: "🏏",
        viewers: "2.5M",
        platform: "YouTube",
        link: "#"
      },
      {
        id: 2,
        title: "AUS vs NZ - ODI Series Decider",
        thumbnail: "🏟️",
        viewers: "890K",
        platform: "Hotstar",
        link: "#"
      },
      {
        id: 3,
        title: "ENG vs WI - Test Match Day 3",
        thumbnail: "🎥",
        viewers: "450K",
        platform: "Sky Sports",
        link: "#"
      },
      {
        id: 4,
        title: "SA vs SL - T20 Series",
        thumbnail: "📺",
        viewers: "320K",
        platform: "SuperSport",
        link: "#"
      }
    ];
    setLiveStreams(mockStreams);
  };

  const fetchCricketHistory = () => {
    const mockHistory = [
      {
        id: 1,
        year: "2011",
        event: "India wins ICC World Cup",
        description: "India defeated Sri Lanka in the final at Wankhede Stadium, Mumbai. MS Dhoni's iconic six sealed the victory.",
        image: "🏆"
      },
      {
        id: 2,
        year: "1983",
        event: "India's First World Cup Victory",
        description: "Kapil Dev led India to their first World Cup triumph, defeating West Indies at Lord's.",
        image: "🎖️"
      },
      {
        id: 3,
        year: "2007",
        event: "First T20 World Cup",
        description: "India won the inaugural ICC T20 World Cup in South Africa under MS Dhoni's captaincy.",
        image: "⭐"
      },
      {
        id: 4,
        year: "1932",
        event: "Bodyline Series",
        description: "The controversial Ashes series that changed cricket forever with aggressive bowling tactics.",
        image: "⚡"
      },
      {
        id: 5,
        year: "2019",
        event: "England's First World Cup",
        description: "England won their first ODI World Cup in a dramatic super over against New Zealand.",
        image: "🏴󠁧󠁢󠁥󠁮󠁧󠁿"
      },
      {
        id: 6,
        year: "1977",
        event: "Kerry Packer Revolution",
        description: "World Series Cricket changed the game forever with colored clothing and night matches.",
        image: "💫"
      }
    ];
    setCricketHistory(mockHistory);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowChat(true);
      return;
    }
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: chatInput,
      sender: "user"
    };
    
    setChatMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botResponses = [
        "That's a great question about cricket! 🏏",
        "I love discussing cricket! Tell me more.",
        "Cricket is the best sport! What else do you want to know?",
        "Amazing question! Let me help you with that.",
        "Great insight! Cricket is fascinating indeed.",
        "Fun fact: The longest cricket match lasted 14 days!",
        "Did you know? Cricket balls can reach speeds over 100 mph!"
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        sender: "bot"
      };
      setChatMessages((prev) => [...prev, botMessage]);
    }, 500);

    setChatInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setShowChat(false);
  };

  return (
    <div className="home-page-cricket">
      {/* 3D Background Animation */}
      <div className="hero-background-3d">
        <div className="floating-cricket-ball"></div>
        <div className="floating-bat"></div>
        <div className="floating-stumps">🏏</div>
      </div>

      {/* Top Navigation Bar */}
      <nav className="top-nav-cricket">
        <div className="nav-content-cricket">
          <div className="nav-logo-cricket">🏏 CricketZone</div>
          <div className="nav-links-cricket">
            <button 
              className={activeTab === "scores" ? "active" : ""}
              onClick={() => setActiveTab("scores")}
            >
              Live Scores
            </button>
            <button 
              className={activeTab === "streams" ? "active" : ""}
              onClick={() => setActiveTab("streams")}
            >
              Live Streams
            </button>
            <button 
              className={activeTab === "history" ? "active" : ""}
              onClick={() => setActiveTab("history")}
            >
              History
            </button>
          </div>
          <div className="nav-user-cricket">
            {isAuthenticated ? (
              <>
                <span className="user-greeting-cricket">
                  👋 {user?.first_name || user?.username}
                </span>
                <button className="logout-btn-cricket" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="nav-signin-btn-cricket"
                  onClick={() => navigate("/auth?mode=login")}
                >
                  Sign In
                </button>
                <button 
                  className="nav-signup-btn-cricket"
                  onClick={() => navigate("/auth?mode=signup")}
                >
                  Join Now
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section-cricket">
        <div className="hero-content-cricket">
          <div className="hero-text-cricket">
            <h1 className="hero-title-cricket">
              <span className="title-gradient">Your Ultimate Cricket Hub</span>
            </h1>
            <p className="hero-subtitle-cricket">
              🏏 Live Scores • 📺 Live Streaming • 🤖 AI Chat • 📚 Cricket History
            </p>
            <div className="hero-stats-cricket">
              <div className="stat-item-cricket">
                <span className="stat-number-cricket">{liveMatches.length}+</span>
                <span className="stat-label-cricket">Live Matches</span>
              </div>
              <div className="stat-item-cricket">
                <span className="stat-number-cricket">{liveStreams.length}+</span>
                <span className="stat-label-cricket">Live Streams</span>
              </div>
              <div className="stat-item-cricket">
                <span className="stat-number-cricket">100K+</span>
                <span className="stat-label-cricket">Active Fans</span>
              </div>
            </div>
          </div>
          
          <div className="hero-image-cricket">
            <div className="animated-card-3d">
              <div className="card-inner-3d">
                <div className="card-front-3d">🏏</div>
                <div className="card-back-3d">🏟️</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="main-content-section-cricket">
        {/* Live Cricket Scores Tab */}
        {activeTab === "scores" && (
          <div className="tab-content-cricket">
            <div className="section-header-cricket">
              <h2>🔴 LIVE CRICKET SCORES</h2>
              <p>Follow all ongoing matches in real-time</p>
            </div>

            <div className="matches-grid-cricket">
              {liveMatches.map((match) => (
                <div key={match.id} className="match-card-cricket">
                  <div className="match-header-cricket">
                    <span className="live-badge-cricket">● LIVE</span>
                    <span className="format-badge-cricket">{match.format}</span>
                  </div>

                  <div className="match-teams-cricket">
                    <div className="team-cricket">
                      <div className="team-flag-cricket">{match.team1Flag}</div>
                      <div className="team-info-cricket">
                        <h3>{match.team1}</h3>
                        <p className="score-cricket">{match.team1Score}</p>
                      </div>
                    </div>

                    <div className="match-divider-cricket">VS</div>

                    <div className="team-cricket">
                      <div className="team-flag-cricket">{match.team2Flag}</div>
                      <div className="team-info-cricket">
                        <h3>{match.team2}</h3>
                        <p className="score-cricket">{match.team2Score}</p>
                      </div>
                    </div>
                  </div>

                  <div className="match-details-cricket">
                    <p className="match-venue-cricket">📍 {match.venue}</p>
                    <p className="match-overs-cricket">Overs: {match.overs}</p>
                  </div>

                  <button className="view-details-btn-cricket">
                    View Full Scorecard →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Streaming Tab */}
        {activeTab === "streams" && (
          <div className="tab-content-cricket">
            <div className="section-header-cricket">
              <h2>📺 LIVE CRICKET STREAMING</h2>
              <p>Watch live cricket matches from around the world</p>
            </div>

            <div className="streams-grid-cricket">
              {liveStreams.map((stream) => (
                <div key={stream.id} className="stream-card-cricket">
                  <div className="stream-thumbnail-cricket">
                    <span className="stream-icon-cricket">{stream.thumbnail}</span>
                    <span className="stream-live-badge-cricket">● LIVE</span>
                  </div>
                  <div className="stream-info-cricket">
                    <h3>{stream.title}</h3>
                    <div className="stream-meta-cricket">
                      <span className="stream-viewers-cricket">
                        👁️ {stream.viewers} watching
                      </span>
                      <span className="stream-platform-cricket">
                        {stream.platform}
                      </span>
                    </div>
                    <button className="watch-stream-btn-cricket">
                      Watch Now 🎬
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cricket History Tab */}
        {activeTab === "history" && (
          <div className="tab-content-cricket">
            <div className="section-header-cricket">
              <h2>📚 CRICKET HISTORY</h2>
              <p>Explore the legendary moments that shaped cricket</p>
            </div>

            <div className="history-timeline-cricket">
              {cricketHistory.map((event, index) => (
                <div 
                  key={event.id} 
                  className={`history-card-cricket ${index % 2 === 0 ? 'left' : 'right'}`}
                >
                  <div className="history-icon-cricket">{event.image}</div>
                  <div className="history-content-cricket">
                    <span className="history-year-cricket">{event.year}</span>
                    <h3>{event.event}</h3>
                    <p>{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="features-section-cricket">
        <div className="section-header-cricket">
          <h2>✨ Why Choose CricketZone?</h2>
        </div>

        <div className="features-grid-cricket">
          <div className="feature-card-cricket">
            <div className="feature-icon-cricket">🏏</div>
            <h3>Live Scores</h3>
            <p>Get real-time updates of all cricket matches worldwide</p>
          </div>

          <div className="feature-card-cricket">
            <div className="feature-icon-cricket">📺</div>
            <h3>Live Streaming</h3>
            <p>Watch matches live from multiple platforms in one place</p>
          </div>

          <div className="feature-card-cricket">
            <div className="feature-icon-cricket">🤖</div>
            <h3>AI Cricket Bot</h3>
            <p>Chat with our AI bot for cricket tips and insights</p>
          </div>

          <div className="feature-card-cricket">
            <div className="feature-icon-cricket">📚</div>
            <h3>Cricket History</h3>
            <p>Explore legendary moments and iconic matches</p>
          </div>
        </div>
      </section>

      {/* Chatbot Widget */}
      <div className={`chatbot-widget-cricket ${showChat ? "active" : ""}`}>
        {isAuthenticated ? (
          <>
            <div className="chatbot-header-cricket">
              <h3>🤖 Cricket Bot</h3>
              <button 
                className="close-chat-btn-cricket"
                onClick={() => setShowChat(false)}
              >
                ✕
              </button>
            </div>

            <div className="chatbot-messages-cricket">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`chat-message-cricket ${msg.sender}`}>
                  <div className="message-content-cricket">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="chatbot-form-cricket">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me about cricket..."
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="chatbot-signin-required-cricket">
            <div className="signin-icon-cricket">🔒</div>
            <h3>Sign In Required</h3>
            <p>Please sign in to chat with our AI cricket bot and enjoy all features</p>
            <button 
              className="chatbot-signin-btn-cricket"
              onClick={() => {
                setShowChat(false);
                navigate("/auth?mode=login");
              }}
            >
              Sign In Now
            </button>
            <button 
              className="chatbot-signup-btn-cricket"
              onClick={() => {
                setShowChat(false);
                navigate("/auth?mode=signup");
              }}
            >
              Create Account
            </button>
            <button 
              className="chatbot-close-btn-cricket"
              onClick={() => setShowChat(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Chat Toggle Button */}
      <button 
        className="chat-toggle-btn-cricket"
        onClick={() => setShowChat(true)}
      >
        💬
      </button>
    </div>
  );
}