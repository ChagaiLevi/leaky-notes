import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import CommentsPage from "./pages/CommentsPage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";

export default function App() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">Local security practice</p>
          <h1>Leaky Notes Lab</h1>
        </div>

        <nav aria-label="Main navigation">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/comments">Comments</NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/comments" element={<CommentsPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}
