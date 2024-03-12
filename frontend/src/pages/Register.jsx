/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "../tailwind.css"; // Import Tailwind CSS file
import bgImg from "./bg.png";

const Register = ({ user }) => {
  // Check if user is already authenticated
  const navigate = useNavigate();
  if (user) {
    navigate("/home");
  }

  // Declarations
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    confirmPassword: "",
  });

  // When credential values change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // When register button is clicked
  const handleRegister = (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
      .then((userCredential) => {
        const userEmail = userCredential.user.email;
        alert(`Successfully Created Account for ${userEmail}`);
      })
      .catch((error) => {
        alert("Error Creating Account");
        console.error(error);
      });
  };

  return (
    <section className="flex items-center justify-center b">
      <div className="form-container bg-white rounded-3xl shadow-lg p-10 m-auto">
        <form onSubmit={handleRegister} className="space-y-1">
          <div className="flex space-x-4">
            <div>
              <label
                className="text-xl century-gothic font-bold"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your First Name"
                name="firstName"
                value={credentials.firstName}
                onChange={handleChange}
                required
                className="form-input rounded-lg w-full"
              />
            </div>
            <div>
              <label
                className="text-xl century-gothic font-bold"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your Last Name"
                name="lastName"
                value={credentials.lastName}
                onChange={handleChange}
                required
                className="form-input rounded-lg w-full"
              />
            </div>
          </div>
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
              className="text-xl century-gothic font-bold "
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
              className="form-input rounded-lg w-full"
            />
          </div>
          <div>
            <label
              className="text-xl century-gothic font-bold"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your Password"
              name="confirmPassword"
              value={credentials.confirmPassword}
              onChange={handleChange}
              required
              className="form-input rounded-lg w-full"
            />
          </div>
          <div className="border-t items-center border-gray-300 w-full"></div>
          <div className="flex flex-col items-center justify-center">
            <button
              type="submit"
              className="text-2xl p-2 form-button rounded-lg bg-main-yellow hover:bg-yellow-500 w-full mt-4 mb-2"
            >
              Register
            </button>
            <div>
              <Link to="/" className="form-link">
                Already have an Account?
              </Link>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Register;
