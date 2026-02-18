import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { authAPI } from "../api/client";
import "../styles/AuthPage.css";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get("mode") || "login";
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "CricketZone — Sign In / Sign Up";
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Account created successfully — redirecting to Home...");
      navigate("/home", { replace: true }); // immediate redirect to Home
    } catch (err) {
      console.error("Sign up error:", err.response?.data || err.message);

      const errorMsg =
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        err.message ||
        "Sign up failed. Try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await authAPI.login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccess("Logged in — redirecting to Home...");
      navigate("/home", { replace: true }); // immediate redirect to Home
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      const errorMsg =
        err.response?.data?.detail ||
        err.message ||
        "Invalid email or password. Try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-cricket">
      <div className="cricket-field-bg">
        <div className="cricket-bat-icon">🏏</div>
        <div className="cricket-ball-icon">⚾</div>
      </div>

      <div className="auth-wrapper-cricket">
        <div className="auth-card-cricket">
          <Link to="/" className="auth-logo-link-cricket">
            <h1 className="auth-logo-cricket">🏏 CricketZone</h1>
          </Link>

          <div className="auth-card-header-cricket">
            <h2>{isLogin ? "Welcome Back!" : "Join CricketZone"}</h2>
            <p className="auth-subtitle-big">
              {isLogin
                ? "Sign in to access live scores and chat"
                : "Create your account and start chatting"}
            </p>
          </div>

          {error && (
            <div className="alert alert-error-cricket">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success-cricket">
              <span className="alert-icon">✓</span>
              {success}
            </div>
          )}

          <form
            onSubmit={isLogin ? handleSignIn : handleSignUp}
            className="auth-form-cricket"
          >
            {isLogin ? (
              <>
                <div className="form-group-cricket">
                  <label htmlFor="email">
                    <span className="label-icon-cricket">📧</span>
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group-cricket">
                  <label htmlFor="password">
                    <span className="label-icon-cricket">🔐</span>
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-group-cricket">
                  <label htmlFor="username">
                    <span className="label-icon-cricket">👤</span>
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Choose your cricket username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group-cricket">
                  <label htmlFor="email">
                    <span className="label-icon-cricket">📧</span>
                    <span>Email</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-row-cricket">
                  <div className="form-group-cricket">
                    <label htmlFor="first_name">
                      <span className="label-icon-cricket">😊</span>
                      <span>First Name</span>
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="form-group-cricket">
                    <label htmlFor="last_name">
                      <span className="label-icon-cricket">😊</span>
                      <span>Last Name</span>
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group-cricket">
                  <label htmlFor="password">
                    <span className="label-icon-cricket">🔐</span>
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group-cricket">
                  <label htmlFor="confirmPassword">
                    <span className="label-icon-cricket">🔐</span>
                    <span>Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            <button
              className="btn btn-primary-cricket submit-btn-cricket"
              disabled={loading}
            >
              <span className="btn-icon-cricket">
                {loading ? "⏳" : isLogin ? "🚀" : "⚡"}
              </span>
              {loading ? "Processing..." : isLogin ? "Sign In" : "Join the Game"}
            </button>
          </form>

          <div className="auth-divider-cricket">
            <span>OR</span>
          </div>

          <div className="auth-toggle-cricket">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Link
                to={`/auth?mode=${isLogin ? "signup" : "login"}`}
                className="toggle-btn-cricket"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </Link>
            </p>
          </div>

          <Link to="/" className="back-link-cricket">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}