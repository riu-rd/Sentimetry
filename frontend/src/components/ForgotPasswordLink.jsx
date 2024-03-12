// ForgotPasswordLink.js
import React from "react";
import { Link } from "react-router-dom";

const ForgotPasswordLink = () => {
  return (
    <Link to="/forgot" className="form-link">
      Forgot Password?
    </Link>
  );
};

export default ForgotPasswordLink;
