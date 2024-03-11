import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import '../tailwind.css'; // Import Tailwind CSS file
import bgImg from './bg.png'

const Register = ({ user }) => {
  // Check if user is already authenticated
  const navigate = useNavigate();
  if (user) {
    navigate('/home');
  }

  // Declarations
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: ''
  });

  // When credential values change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  // When register button is clicked
  const handleRegister = (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
        const userEmail = userCredential.user.email;
        alert(`Successfully Created Account for ${userEmail}`);
      })
      .catch((error) => {
        alert("Error Creating Account");
        console.error(error);
      });
  }

  return (
    <section className="form-container bg-white rounded-lg shadow-lg p-8">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor='firstName'>First Name</label>
            <input
              type='text'
              placeholder='Enter your First Name'
              name='firstName'
              value={credentials.firstName}
              onChange={handleChange}
              required
              className="form-input rounded-md"
            />
          </div>
          <div className="flex-1 ml-auto">
            <label htmlFor='lastName'>Last Name</label>
            <input
              type='text'
              placeholder='Enter your Last Name'
              name='lastName'
              value={credentials.lastName}
              onChange={handleChange}
              required
              className="form-input rounded-md"
            />
          </div>
        </div>
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
        </div>
        <div>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            type='password'
            placeholder='Confirm your Password'
            name='confirmPassword'
            value={credentials.confirmPassword}
            onChange={handleChange}
            required
            className="form-input rounded-md"
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Link to='/' className="form-link">Already have an Account?</Link>
          </div>
          <button type='submit' className="form-button rounded-3xl bg-yellow-400 hover:bg-yellow-500 text-sm md:text-base mr-4">Done</button>  
        </div>
      </form>
    </section>
  )
}

export default Register;
