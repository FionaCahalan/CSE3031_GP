import './AddSection.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


function AddSection() {
  let navigate = useNavigate();
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

  if(!authUser)
  {
    navigate('/login');
  }

  async function check(event) {
    event.preventDefault();
        
        const auth = getAuth();
        const user = auth.currentUser;
        if(!user) {
            await navigate('/login');
            return;
        }

        var error = false;
        
        var section = document.getElementById('section').value;
        section = section.trim();
        if(section === "")
        {
          document.getElementById("sectionError").textContent = "*Required: Input a section number";
          error = true; 
        } else if(section.length !== 5) {
          document.getElementById("sectionError").textContent = "*Required: Input a 5 digit section number";
          error = true;
        } else if(isNaN(section)) {
          document.getElementById("sectionError").textContent = "*Required: Input a 5 digit section number";
          error = true;
        }
        if(error)
        {
            return false;
        }
        var email = user.email;
        const docRef = doc(db, "sectionNumbers", section);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
          const curr = doc(db, "users", email);
          getDoc(curr).then(async (snapshot)=> {
            console.log("HERE");
            console.log(email);
            const courses = snapshot.data().Student;
            console.log("THERE");

            if(courses.length === 0)
            {
              await updateDoc(curr, {
                Student:  [section]
              });
            } else
            {
              await updateDoc(curr, {
                Student: arrayUnion.apply(this, [section])
              });
            }
            document.getElementById("sectionError").textContent = "Success! Course added.";
          });
        }
  }

  return (
    <div className="form">
        <form className = "form" id = "addSectionForm" onSubmit={check}>
            <div className = "addSectionInstructions">
                <h2>Add Section</h2>
                 <p>Add section number for your course below. Once submitted, your calendar will update with the corresponding office hours.</p>
            </div>
            <div className = "question">
                <label htmlFor='section'>Section:<pre className="errorMsg" id="sectionError"></pre></label>
                <input type='text' id='section' autoFocus placeholder="12345"></input>
            </div>
            <p className ="errorMsg" id="submitError"></p>
            <input type = "submit" id='submitAddSection'></input>
        </form>
    </div>
  );
}

export default AddSection;