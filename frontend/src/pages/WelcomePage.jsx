import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function WelcomePage() {
  const [showModal, setShowModal] = useState(false);
  const [cricketRecord, setCricketRecord] = useState("");
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "";

  useEffect(() => {
    async function loadDaily() {
      try {
        const res = await fetch(`${API}/cricket/records/daily/`);
        const data = await res.json();
        setCricketRecord(data?.record || "Cricket awaits your legacy...");
      } catch (err) {
        setCricketRecord("🏆 Greatest moments in cricket history unfold every day!");
      } finally {
        setLoading(false);
      }
    }
    loadDaily();
  }, []);

  const fetchCricketRecord = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cricket/records/daily/");
      setCricketRecord(res.data?.record || "Cricket awaits your legacy...");
    } catch (err) {
      setCricketRecord("🏆 Greatest moments in cricket history unfold every day!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="animated-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
      </div>

      <section className="hero-container">
        <div className="hero-card">
          <div className="left-section">
            <div className="logo-wrapper">
              <img src="/logo.png" alt="CricketZone" className="logo" />
            </div>

            <div className="badge-row">
              <span className="badge live">🔴 LIVE</span>
              <span className="badge">⚡ Real-time</span>
              <span className="badge">🤖 AI Powered</span>
            </div>

            <h1 className="hero-title">
              Experience
              <br />
              <span className="gradient-text">Cricket Like Never Before</span>
            </h1>

            <p className="hero-description">
              Join thousands of cricket fans enjoying live scores, match predictions, 
              team insights, and intelligent chatbot assistance — all in one platform.
            </p>

            <div className="cta-buttons">
              <button onClick={() => setShowModal(true)} className="btn btn-primary">
                <span>Continue Without Sign In</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
              <Link to="/auth?mode=login" className="btn btn-secondary">
                Sign In
              </Link>
            </div>

            <div className="stats-row">
              <div className="stat">
                <h3>10K+</h3>
                <p>Active Users</p>
              </div>
              <div className="stat">
                <h3>500+</h3>
                <p>Live Matches</p>
              </div>
              <div className="stat">
                <h3>24/7</h3>
                <p>Support</p>
              </div>
            </div>
          </div>

          <div className="right-section">
            <div className="feature-card floating">
              <div className="feature-icon">🏏</div>
              <h3>Live Match Updates</h3>
              <p>Real-time scores and commentary</p>
            </div>

            <div className="feature-card floating delay-1">
              <div className="feature-icon">📊</div>
              <h3>Team Analytics</h3>
              <p>Deep insights and statistics</p>
            </div>

            <div className="cricket-record floating delay-2">
              <div className="record-header">
                <span className="record-icon">📜</span>
                <h4>Today's Cricket Record</h4>
              </div>
              {loading ? (
                <p className="record-text skeleton">Loading cricket history...</p>
              ) : (
                <p className="record-text">{cricketRecord}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">🤖</div>
            <h3>AI Chatbot Restricted</h3>
            <p>Without sign up, you can't use our AI chatbot feature. Please create an account to unlock full access.</p>
            <div className="modal-actions">
              <Link to="/auth?mode=signup" className="btn btn-primary">
                Sign Up Now
              </Link>
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">
                Continue Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}