import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
