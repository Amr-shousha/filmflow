import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import "../../src/Authentication.css"; // هننشئ الملف ده دلوقتي

export default function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from || "/";
  const handleAuth = async (type) => {
    const { data, error } =
      type === "signup"
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: displayName,
              },
            },
          })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) alert(error.message);
    else navigate(redirectTo);
  };

  const signUP = () => {
    setIsSignUp((cur) => !cur);
  };
  return (
    <div className="auth-wrapper d-flex align-items-center justify-content-center">
      <div className="auth-card p-4 p-md-5">
        <h2 className="auth-title">
          Welcome to <span className="brand-text">FilmFlow</span>
        </h2>
        {isSignUp ? (
          <p className="auth-subtitle mb-4">Sign Up to manage your favorites</p>
        ) : (
          <p className="auth-subtitle mb-4">Sign in to manage your favorites</p>
        )}

        <div className="input-group-custom">
          {isSignUp && (
            <input
              type="text"
              className="form-control custom-input mb-3"
              placeholder="Your Name"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          <input
            type="email"
            className="form-control custom-input mb-3"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="form-control custom-input mb-4"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="d-grid gap-2">
          {!isSignUp && (
            <button
              onClick={() => handleAuth("login")}
              className="btn btn-primary-gradient py-2 shadow-sm"
            >
              Login
            </button>
          )}
          {!isSignUp && (
            <button
              onClick={() => signUP()}
              className="btn btn-outline-purple py-2"
            >
              Create Account
            </button>
          )}{" "}
          {isSignUp && (
            <button
              onClick={() => handleAuth("signup")}
              className="btn btn-outline-purple py-2"
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
