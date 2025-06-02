import React, { useState } from "react";
import useAppStore from "../store/useAppStore";
import { useNavigate, useLocation } from "react-router-dom";
import { HOME } from "../Routes/routes";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const login = useAppStore((state) => state.login);
  const isLoadingAuth = useAppStore((state) => state.isLoadingAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || HOME;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }
    const success = await login(username, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="login-form-group">
          <label htmlFor="username" className="login-label">
            Username:
          </label>
          <input
            type="text"
            id="username"
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="login-form-group">
          <label htmlFor="password" className="login-label">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="login-error-message">{error}</p>}
        <button type="submit" disabled={isLoadingAuth}className="login-button">
          {isLoadingAuth ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
