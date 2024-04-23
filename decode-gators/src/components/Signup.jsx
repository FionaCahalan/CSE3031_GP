import React, { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import './Signup.css';

const Signup = () => {
  // States & Setters
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
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

  // Signup Handler (Button)
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
        // Create field for the user with blank arrays for professor, student and TA
        await setDoc(doc(db, "users", email.toLowerCase()), {Professor: [], Student: [], TA: []});
        navigate('/home'); // Navigate to the home page after successful signup
      })
      .catch((error) => {
        console.error('Error signing up:', error);
      });
  };

  // If user already signed in on signup page,
  // send user to home page
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
