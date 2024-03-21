/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from '../firebase.js';
import "../tailwind.css"; // Import Tailwind CSS file

const Register = ({user}) => {
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
  const usersCollectionRef = collection(db, "users");

  // Clear Credentials
  const clearCredentials = () => {
    setCredentials({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        confirmPassword: "",
      });
  }

  // When credential values change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // When register button is clicked
  const handleRegister = (e) => {
    e.preventDefault();

    console.log(credentials)
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
        const userDocRef = doc(usersCollectionRef, `${userCredential.user.uid}`)
        setDoc(userDocRef, {
            firstName: credentials.firstName,
            lastName: credentials.lastName
        })
        .then(() => {
            clearCredentials();
        })
        .catch((err) => {
            alert("Firestore Registration Error");
            console.error(err);
        });
      })
      .catch((error) => {
        alert("Authentication Error");
        console.error(error);
        clearCredentials();
      });
  };

  return (
    <section className="flex flex-row items-center justify-center h-screen w-screen">
    <div className="flex flex-col lg:flex-row items-center justify-center lg:h-screen scale-75 sm:scale-90 lg:scale-100">
        <div>
            <div className="text-center text-main-yellow w-full">
                <h1 className="drop-shadow-xl text-7xl sm:text-8xl md:text-8xl lg:text-8xl xl:text-9xl century-gothic font-extrabold mx-8 my-4 mt-">
                SentiMetry
                </h1>
                <h2 className="drop-shadow-xl linden-hill-regular text-2xl text-white">
                Navigate Your Inner Landscape, One Entry at a Time
                </h2>
            </div>
            <div className="form-container bg-white rounded-3xl shadow-lg p-10 mt-8 w-11/12 sm:w-full">
                <form onSubmit={handleRegister} className="space-y-1">
                    <div className="flex space-x-4 w-full">
                        <div className="w-full">
                            <label
                                className="text-xl century-gothic font-bold text-black"
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
                                className="form-input rounded-lg w-full text-black"
                            />
                        </div>
                        <div className="w-full">
                            <label
                                className="text-xl century-gothic font-bold text-black"
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
                                className="form-input rounded-lg w-full text-black"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xl century-gothic font-bold text-black" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            name="email"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                            className="form-input rounded-lg w-full text-black"
                        />
                    </div>
                    <div>
                        <label
                            className="text-xl century-gothic font-bold text-black"
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
                            className="form-input rounded-lg w-full text-black"
                        />
                    </div>
                    <div>
                        <label
                            className="text-xl century-gothic font-bold text-black"
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
                            className="form-input rounded-lg w-full text-black"
                        />
                    </div>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <button
                            type="submit"
                            className="text-2xl p-2 form-button rounded-lg bg-main-yellow hover:bg-yellow-500 w-full mt-4 mb-2"
                        >
                            Register
                        </button>
                    </div>
                </form>   

                <div className="mx-auto text-center">
                    <button className="text-blue-500 m-0 bg-transparent" onClick={() => navigate('/login')}>
                        Already have an Account?
                    </button>
                </div>
            </div>
        </div>
    </div>    
    </section>
  );
};

export default Register;
