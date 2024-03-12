import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../tailwind.css"; // Import Tailwind CSS file
import ForgotPasswordLink from "./ForgotPasswordLink";

const Login = ({ user }) => {
  // Check if user is already authenticated
  const navigate = useNavigate();

  // Declarations
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  // When credential values change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // When log in button is clicked
  const handleLogin = async (e) => {
    e.preventDefault();

    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const userEmail = userCredential.user.email;
      alert(`Successfully Logged in: ${userEmail}`);

      // Redirect to "/home" after successful login
      navigate("/home");
    } catch (error) {
      alert("Error Logging In");
      console.error(error);
    }
  };
  return (
    <section className="flex items-center justify-center">
      <div className="form-container bg-white rounded-3xl shadow-lg p-10 mt-8">
        <form onSubmit={handleLogin} className="space-y-1">
          <div>
            <label className="text-xl century-gothic font-bold" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your Email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              className="form-input rounded-lg w-full"
            />
          </div>
          <div>
            <label
              className="text-xl century-gothic font-bold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your Password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              className="form-input rounded-lg w-full mb-0"
            />

            <div className="flex justify-start mb-4 mt-1 pl-2">
              <ForgotPasswordLink />
            </div>

            <div className="border-t items-center border-gray-300 w-full"></div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="text-2xl p-2 form-button rounded-lg bg-main-yellow hover:bg-yellow-500 w-full mt-4 mb-2"
              >
                Login
              </button>
              <div>
                <Link to="/register" className="form-link">
                  Don't have an account?
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Login;
