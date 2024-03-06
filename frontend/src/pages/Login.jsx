import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = ({user}) => {
  // Check if user is already authenticated
  const navigate = useNavigate();
  if (user) {
    navigate('/home');
  }

  // Declarations
  const [credentials, setCredentials] = useState({email: '', password: ''});

  // When credential values change
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  // When log in button is clicked
  const handleRegister = (e) => {
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
    <section>
      <h1>Login</h1>
      <form 
      onSubmit={handleRegister}>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          placeholder='Enter your Email'
          name='email'
          value={credentials.email}
          onChange={handleChange}
          required
        />

        <label htmlFor='password'>Password</label>
        <input
          type='password'
          placeholder='Enter your Password'
          name='password'
          value={credentials.password}
          onChange={handleChange}
          required
        />

        <button type='submit'>Login</button>
        
      </form>
      <Link to='/register'>Go to Register</Link>
    </section>
  )
}

export default Login;