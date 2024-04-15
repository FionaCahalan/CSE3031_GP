import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from './../firebase';
import { getDoc, doc, collection, getDocs} from 'firebase/firestore';
import './Homepage.css';

const Homepage = () => {
    return(
        <div>
            <MyHomepage />
        </div>
    );
    
}

function MyHomepage() {
    let navigate = useNavigate();
    const auth = getAuth();
    const [user, setUser] = useState(null);
    const [isProfessor, setIsProfessor] = useState(false);

    useEffect(() => {
      onAuthStateChanged(auth, currentUser => {
        setUser(currentUser);
        if(currentUser){
          check(currentUser);
        } else {
          setIsProfessor(false);
        }
      });
    }, []);
  
    function handleClick(path) {
      navigate(path);
    }

    const userSignOut = () => {
      signOut(auth).then(() => {
        console.log('sign out successful')
      }).catch(error => console.log(error))
    }

    async function check(user){
      var email = user.email;
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()){
        const curr = doc(db, "users", email);
        getDoc(curr).then(async (snapshot)=> {
          const classes_is_prof = snapshot.data().Professor;
          setIsProfessor(classes_is_prof.length > 0);
        });
        console.log("Is Professor: ", isProfessor);
      } else {
        setIsProfessor(false);
      }
    }

    return (
      <div>        
        {!user ? (
          <button className="nav-button" type="button" onClick={() => handleClick('/login')}>Login</button>
        ) : (
          <>
          <button className = "nav-button" type="button" onClick={userSignOut}>Sign Out</button>
          <button className="nav-button" type="button" onClick={() => handleClick('/calendar')}>Calendar</button>

          {isProfessor && (<button className = "nav-button" type="button" onClick={() => handleClick('/addhours')}>Add Office Hours</button>)}
          </>
        )}
      </div>
    );
}

export default Homepage;