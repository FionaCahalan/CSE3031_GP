import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if(user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

      return () => {
        listen();
      }
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();

    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Password validation: at least 6 characters
    const isPasswordValid = password.length >= 6;

    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address');
      return; // Exit function if email is invalid
    } else {
      setEmailError('');
    }

    if (!isPasswordValid) {
      setPasswordError('Password must be at least 6 characters long');
      return; // Exit function if password is invalid
    } else {
      setPasswordError('');
    }

    // If email and password are valid, proceed with creating the user account
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log('User signed up successfully:', userCredential.user);
        await setDoc(doc(db, "users", email.toLowerCase()), {Professor: [], Student: [], TA: []});
        navigate('/home'); // Navigate to the home page after successful signup
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
  };

  if(authUser) {
    navigate('/home');
  }

  return (
    <div className="signup-container">
      <h1>Office Hours Sign Up</h1>
      <form>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          <p className="error-message">{emailError}</p>
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password (at least 6 characters)"
          />
          <p className="error-message">{passwordError}</p>
        </div>
        <button className="signup-button" type="button" onClick={handleSignup}>
          Sign Up
        </button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Signup;
