import React from "react";
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const Homepage = () => {
    return(
        <div className="button-container">
            <MyButton />
        </div>
    );
}

function MyButton() {
    let navigate = useNavigate();
  
    function handleClick(path) {
      navigate(path);
    }
  
    return (
      <div>
        <button className="nav-button" type="button" onClick={() => handleClick('/calendar')}>Calendar</button>
        <button className="nav-button" type="button" onClick={() => handleClick('/login')}>Sign Out</button>
      </div>
    );
}

export default Homepage;
