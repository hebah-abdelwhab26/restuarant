
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Header from "../Home/Header";
import Topbar from "../Home/Topbar";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8080/api",
  timeout: 10000,
});

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await apiClient.post("/login", {
        email: email.trim(),
        password,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error("لم يتم استلام رمز المصادقة من الخادم.");
      }

      const meResponse = await apiClient.get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = meResponse.data.user;

      if (!user) {
        throw new Error("تعذر الحصول على بيانات الحساب.");
      }

      // امسحي أي جلسة قديمة قبل حفظ الجلسة الجديدة.
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_user");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("auth_token", token);
      storage.setItem("auth_user", JSON.stringify(user));

      // تحديث المكونات التي تعتمد على حالة تسجيل الدخول.
      window.dispatchEvent(new Event("auth-changed"));

      // المدير إلى لوحة الإدارة، والعميل إلى الصفحة الرئيسية.
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setError(
          err.response.data?.errors?.email?.[0] ||
            err.response.data?.message ||
            "البريد الإلكتروني أو كلمة المرور غير صحيحة."
        );
      } else if (err.response?.status === 401) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else if (err.response?.status === 403) {
        setError("ليس لديك صلاحية لتنفيذ هذه العملية.");
      } else {
        setError(
          err.response?.data?.message ||
            err.message ||
            "تعذر الاتصال بالخادم. تأكدي من تشغيل Laravel."
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

      <section id="login" className="login">
        <div
          className="container"
          style={{
            width: "50%",
            textAlign: "center",
            height: "300px",
          }}
        >
          <form
            className="form-left"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <h2 className="headline-1 text-center">Login</h2>

            <p className="form-text text-center">
              Please login to your account
            </p>

            {error && (
              <p
                className="form-text text-center error-text"
                role="alert"
              >
                {error}
              </p>
            )}

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
                aria-label="Google login"
                disabled
                title="Google login is not configured yet"
              >
                <ion-icon name="logo-google" />
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
                aria-label="Facebook login"
                disabled
                title="Facebook login is not configured yet"
              >
                <ion-icon name="logo-facebook" />
              </button>
            </div>

            <br />

            <div className="or-divider">
              <span></span>
              <span>OR</span>
              <span></span>
            </div>

            <br />

            <div className="input-wrapper">
              <div className="icon-wrapper">
                <ion-icon name="mail-outline" />
                <input
                  type="email"
                  className="input-field"
                  placeholder="Email Address"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-wrapper">
              <div className="icon-wrapper">
                <ion-icon name="lock-closed-outline" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="remember-row">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />
                <label
                  htmlFor="rememberMe"
                  className="remember-label"
                >
                  Remember me
                </label>
              </div>

              <div>
                <Link to="/forgot-password" className="link">
                  Forgot password?
                </Link>
              </div>
            </div>

            <br />

            <button
              type="submit"
              className="btn btn-secondary full-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            <p className="form-text text-center bottom-text">
              Don’t have an account?{" "}
              <Link to="/register" className="link">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;

