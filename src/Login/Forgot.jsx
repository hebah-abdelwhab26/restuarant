import React from 'react'
import { useState } from "react";
import "./Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setError("");
    setMessage("Password reset link sent to your email (UI only)");
    console.log(email);
  };

  return (
     <div>
          <br/><br/><br/><br/><br/> <br/><br/>
      <div className="container"  style={{width:"70%",
       height:"750px",display:"flex" ,flexDirection:"column",alignItems:"center",justifyContent:"center"}}>

        <div className="form reservation-form bg-black-10">

          <form  className="form-left" onSubmit={handleSubmit} autoComplete="off">

            <h2 className="headline-1 text-center">
              Forgot Password
            </h2>

            <p className="form-text text-center">
              Enter your email to reset your password
            </p>

            {error && (
              <p className="form-text text-center" style={{ color: "red" }}>
                {error}
              </p>
            )}

            {message && (
              <p className="form-text text-center" style={{ color: "green" }}>
                {message}
              </p>
            )}

            <div className="input-wrapper">
              <div className="icon-wrapper">
                <ion-icon name="mail-outline"></ion-icon>

                <input
                  type="email"
                  className="input-field"
                  placeholder="Email Address"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-secondary">
              <span className="text text-1">Send Reset Link</span>
              <span className="text text-2" aria-hidden="true">
                Send Reset Link
              </span>
            </button>

            <p className="form-text text-center" style={{ marginTop: "15px" }}>
              Remember your password?{" "}
              <a href="/login" className="link">
                Login
              </a>
            </p>

          </form>

        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
