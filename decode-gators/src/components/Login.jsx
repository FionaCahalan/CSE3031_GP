import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";

import './Login.css';

const Login = () => {
  // States & Setters
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();

  // Listener function to determine user validity
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      // If user signed in, assign authenticated user to its
      // correct profile
      if(user) {
        setAuthUser(user);
      } else {
        // Else set to null user
        setAuthUser(null);
      }
    });

      return () => {
        listen();
      }
  }, []);

  // Login Handler (Button)
  const handleLogin = (e) => {
    e.preventDefault();
  
    // If email and password are valid, proceed with signing in
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('User signed in successfully:', userCredential.user);
        navigate('/home'); // Navigate to the home page after successful login
      })
      .catch((error) => {
        // If error signing in, output error
        console.error('Error signing in:', error);
        setLoginError('Invalid Email/Password');
      });
  };

    // If user already signed in on login page,
    // send to home page
    if(authUser) {
      navigate('/home');
    }

    return (
        <div className="login-container">
          <h1>Office Hours Login</h1>
          <form>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <p className="error-message">{loginError}</p>
            </div>
            <button className="login-button" type="button" onClick={handleLogin}>
              Sign In
            </button>
          </form>
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
    );
}

export default Login;