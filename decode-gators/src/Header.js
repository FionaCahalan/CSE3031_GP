import React, {useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from './firebase';
import './Header.css';

function Header() {
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(null);

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

  // Signout Handler (Button)
  const handleSignout = async () => {
    try {
      await signOut(auth); // Call the signout function
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Home navigation (Button)
  const handleHome = async () => {
    navigate('/home');
  };

  if(authUser){
    return (
      <div className="Header">
          <div className='home-button-container'>
            <button className="home-button" onClick={handleHome}>
              Home
            </button>
          </div>
          <h1 className='title'>Gator Office Hours</h1>
          <div className="signout-button-container">
            <button className="signout-button" onClick={handleSignout}>
              Sign Out
            </button>
          </div>
          <hr></hr>
        </div>
    );
  }
  return (
    <div className="Header">
        <h1 className='title'>Gator Office Hours</h1>
        <hr></hr>
      </div>
  );
}

export default Header;
