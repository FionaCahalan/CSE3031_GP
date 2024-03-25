//import { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Header from './Header';
import AddHours from './AddHours';

function App() {

    return (
      <Router>
        <Header/>
        
        <Routes>
          <Route path="/" element={<AddHours/>} />
        </Routes>
      </Router>
    );
  }
  
  export default App;