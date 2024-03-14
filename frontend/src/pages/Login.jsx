import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "../tailwind.css"; // Import Tailwind CSS file
import ForgotPasswordLink from "../components/ForgotPasswordLink";

const Login = (props) => {
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
        <div>
            <div className="text-center text-main-yellow">
                <h1 className="drop-shadow-xl text-9xl century-gothic font-extrabold mx-8 my-4 mt-">
                SentiMetry
                </h1>
                <h2 className="drop-shadow-xl linden-hill-regular text-2xl text-white">
                Navigate Your Inner Landscape, One Entry at a Time
                </h2>
            </div>
            <div className="form-container bg-white rounded-3xl shadow-lg p-10 mt-8">
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <div>
                            <label
                                className="text-xl century-gothic font-bold text-black"
                                htmlFor="firstName"
                                >
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Enter your Email"
                                name="email"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                                className="form-input rounded-xl w-full text-black"
                            />
                        </div>
                        <div>
                            <label
                                className="text-xl century-gothic font-bold text-black"
                                htmlFor="firstName"
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
                                className="form-input rounded-xl w-full mb-0 text-black"
                            />
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center gap-1 ">
                        <button
                            type="submit"
                            className="text-2xl p-2 form-button rounded-xl bg-main-yellow hover:bg-yellow-500 w-full mt-4 mb-2">
                            Login
                        </button>
                        <div className="flex m-0 space-x-20">
                            <button className="bg-transparent text-blue-500 m-0 hover:underline underline-offset-2" onClick={() => navigate('/forgot')}>
                                Forgot Password?
                            </button>
                            <button className="bg-transparent text-blue-500 m-0 hover:underline underline-offset-2" onClick={() => navigate('/register')}>
                                Don't have an account?
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
    </section>
  );
};

export default Login;
