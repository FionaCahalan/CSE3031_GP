import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { db } from './../firebase';
import { getDoc, doc} from 'firebase/firestore';
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
    const [isProfessor, setisProfessor] = useState(false);
    const [isTA, setisTA] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
      onAuthStateChanged(auth, currentUser => {
        setUser(currentUser);
        if(currentUser){

          async function check(user){
            var email = user.email;
            const docRef = doc(db, "users", email);
            const docSnap = await getDoc(docRef);
            console.log("user email ", email);
            //looks at arrays in users collection to determine if user is TA or Professor
            if(docSnap.exists()){
              const curr = doc(db, "users", email);
              getDoc(curr).then(async (snapshot)=> {
                //if Professor array exists, else assign to empty array
                const classes_is_prof = snapshot.data().Professor || [];
                setisProfessor(classes_is_prof?.length > 0);
                const classes_is_TA = snapshot.data().TA || [];
                setisTA(classes_is_TA?.length > 0);
              });
            } else {
              setisProfessor(false);
              setisTA(false);
            }

            console.log("Is Professor: ", isProfessor);
            console.log("Is TA: ", isTA);

            //looks in admin document to see if user is admin
            const docRef1 = doc(db, "admin", email);
            const docSnap1 = await getDoc(docRef1);
            if(docSnap1.exists()){
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }

          check(currentUser);
        } else {
          setisProfessor(false);
          setIsAdmin(false);
        }
      });
    }, [auth, isProfessor, isTA]);
  
    function handleClick(path) {
      navigate(path);
    }

    const userSignOut = () => {
      signOut(auth).then(() => {
        console.log('sign out successful')
      }).catch(error => console.log(error))
    }

    return (
      <div>        
        
        {!user ? (
          //if not user, gets login button
          <button className="nav-button" type="button" onClick={() => handleClick('/login')}>Login</button>
        ) : (
          //determins which buttons to show depending on if they're a admin, student, professor, or TA
          <>
          <button className = "nav-button" type="button" onClick={userSignOut}>Sign Out</button>

          {isProfessor | isTA && (<>
            <button className="nav-button" type="button" onClick={() => handleClick('/addhours')}>Add Office Hours</button>
            <button className="nav-button" type="button" onClick={() => handleClick('/deletehours')}>Remove Office Hours</button>
          </>)}

          {isAdmin ? (
            <button className="nav-button" type="button" onClick={() => handleClick('/admin')}>Admin</button>
          ) : (
            <>
            <button className="nav-button" type="button" onClick={() => handleClick('/calendar')}>Calendar</button>
            {!isProfessor && (<button className="nav-button" type="button" onClick={() => handleClick('/addsection')}>Add Section</button>)}
            </>
          )}

          </>
        )}
      </div>
    );
}

export default Homepage;
