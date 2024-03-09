import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import '../tailwind.css'; // Import Tailwind CSS file

const Login = ({ user }) => {
  // Check if user is already authenticated
  const navigate = useNavigate();
  if (user) {
    navigate('/home');
  }

  // Declarations
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // When credential values change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  // When log in button is clicked
  const handleLogin = (e) => {
    e.preventDefault();

    const auth = getAuth();
    signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
        const userEmail = userCredential.user.email;
        alert(`Successfully Logged in: ${userEmail}`)
      })
      .catch((error) => {
        alert("Error Logging In");
        console.error(error);
      });
  }

  return (
    <section className="form-container bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            placeholder='Enter your Email'
            name='email'
            value={credentials.email}
            onChange={handleChange}
            required
            className="form-input rounded-md"
          />
        </div>
        <div>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            placeholder='Enter your Password'
            name='password'
            value={credentials.password}
            onChange={handleChange}
            required
            className="form-input rounded-md"
          />
          <div className="flex items-center justify-between">
            <div>
              <Link to='/register' className="form-link">Don't have an account?</Link>
            </div>
            <button type='submit' className="form-button rounded-3xl mt-4 bg-yellow-400 hover:bg-yellow-500">Login</button>
          </div>
        </div>
      </form>
      
    </section>
  )
}

export default Login;
