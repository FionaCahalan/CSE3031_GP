import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from './../firebase';
import { getDoc, doc/*, collection, getDocs*/} from 'firebase/firestore';
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
    const [isProfessorTA, setIsProfessorTA] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      onAuthStateChanged(auth, currentUser => {
        setUser(currentUser);
        if(currentUser){
          check(currentUser);
        } else {
          setIsProfessorTA(false);
          setIsAdmin(false);
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
          setIsProfessorTA(classes_is_prof.length > 0);
          if(!isProfessorTA){
            const classes_is_TA = snapshot.data().TA;
            setIsProfessorTA(classes_is_TA.length > 0);
          }
        });
        console.log("Is Professor: ", isProfessorTA);
      } else {
        setIsProfessorTA(false);
      }

      const docRef1 = doc(db, "admin", email);
      const docSnap1 = await getDoc(docRef1);
      if(docSnap1.exists()){
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }

    return (
      <div>        
        
        {!user ? (
          <button className="nav-button" type="button" onClick={() => handleClick('/login')}>Login</button>
        ) : (
          <>
          <button className = "nav-button" type="button" onClick={userSignOut}>Sign Out</button>

          {isProfessorTA ? (
            <>
            <button className = "nav-button" type="button" onClick={() => handleClick('/addhours')}>Add Office Hours</button>
            <button className="nav-button" type="button" onClick={() => handleClick('/calendar')}>Calendar</button>
            </>
          ) : (
            <>
            {isAdmin ? (
              <button className="nav-button" type="button" onClick={() => handleClick('/admin')}>Admin</button>
            ) :(
              <button className="nav-button" type="button" onClick={() => handleClick('/calendar')}>Calendar</button>
            )}
            </>
          )}
          </>
        )}
      </div>
    );
}

export default Homepage;
