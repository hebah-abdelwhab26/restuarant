
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Header from "../Home/Header";
import Topbar from "../Home/Topbar";

const API_URL = "https://restaurant.hebahgift.com/api";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API_URL}/register`, {
        name: name.trim(),
        email: email.trim(),
        password,
        password_confirmation: confirmPassword,
      });

      const { user, token, message } = response.data;

      if (!token) {
        setError("Account created, but no login token was returned.");
        return;
      }

      // Use the same token key as the existing login page.
  sessionStorage.removeItem("user");
localStorage.removeItem("user");
localStorage.removeItem("auth_token");
localStorage.removeItem("auth_user");

sessionStorage.setItem("auth_token", token);

if (user) {
  sessionStorage.setItem("auth_user", JSON.stringify(user));
}

window.dispatchEvent(new Event("auth-changed"));

      setSuccess(message || "Account created successfully.");

      // Navigate to the main page after successful registration.
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      if (err.response?.status === 422) {
        const errors = err.response.data?.errors;

        if (errors) {
          setError(
            Object.values(errors).flat().join(" ")
          );
        } else {
          setError(
            err.response.data?.message ||
              "Please check your registration details."
          );
        }
      } else if (!err.response) {
        setError(
          "Cannot connect to the server. Make sure Laravel is running on port 8080."
        );
      } else {
        setError(
          err.response.data?.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Topbar />
      <Header />

      <br /><br /><br /><br /><br /><br /><br />

      <section id="register" className="Login">
        <div
          className="container"
          style={{ width: "50%", textAlign: "center" }}
        >
          <form
            className="form-left"
            onSubmit={handleRegister}
            autoComplete="off"
          >
            <h2 className="headline-1 text-center">Register</h2>

            <p className="form-text text-center">
              Create your account
            </p>

            {error && (
              <p
                className="form-text text-center error-text"
                role="alert"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                className="form-text text-center"
                role="status"
                style={{ color: "green" }}
              >
                {success}
              </p>
            )}

            {/* Social Register */}
            <div
              className="input-wrapper social-wrapper"
              style={{
                display: "flex",
                gap: "25px",
                textAlign: "center",
              }}
            >
              <button
                type="button"
                className="btn btn-secondary social-btn"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "30px",
                }}
                aria-label="Register with Google"
                title="Google registration is not configured"
              >
                <ion-icon name="logo-google"></ion-icon>
              </button>

              <button
                type="button"
                className="btn btn-secondary social-btn"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "30px",
                }}
                aria-label="Register with Facebook"
                title="Facebook registration is not configured"
              >
                <ion-icon name="logo-facebook"></ion-icon>
              </button>
            </div>

            <br />

            <div className="or-divider">
              <span></span>
              <span>OR</span>
              <span></span>
            </div>

            <br />

            {/* Full Name */}
            <div className="input-wrapper">
              <div className="icon-wrapper">
                <ion-icon name="person-outline"></ion-icon>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Full Name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="input-wrapper">
              <div className="icon-wrapper">
                <ion-icon name="mail-outline"></ion-icon>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Email Address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-wrapper">
              <div className="icon-wrapper">
                <ion-icon name="lock-closed-outline"></ion-icon>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={loading}
                />

                <ion-icon
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="input-wrapper">
              <div className="icon-wrapper">
                <ion-icon name="lock-open-outline"></ion-icon>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                  minLength={8}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Terms */}
            <div
              className="remember-row"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <input type="checkbox" id="register-terms" required />
              <label
                htmlFor="register-terms"
                className="remember-label"
              >
                I agree to the Terms &amp; Conditions
              </label>
            </div>

            <br />

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-secondary full-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>

            <p className="form-text text-center bottom-text">
              Already have an account?{" "}
              <Link to="/login" className="link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Register;

