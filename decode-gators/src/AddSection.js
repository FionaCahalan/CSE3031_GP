import './AddSection.css';
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


function AddSection() {
  // States & Setters
  const [authUser, setAuthUser] = useState(null);
  let navigate = useNavigate();

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

  // If user not signed in on addsection page,
  // send user to login page
  if(authUser === null)
  {
    navigate('/login');
  }

  // Add Section submission (Button)
  async function check(event) {
    event.preventDefault();
        
        const auth = getAuth();
        const user = auth.currentUser;
        // If user not signed in, send to login
        if(!user) {
            navigate('/login');
            return;
        }

        // Input validation
        var error = false;
        var section = document.getElementById('section').value;
        section = section.trim();
        // No input for section
        if(section === "")
        {
          document.getElementById("sectionError").textContent = "*Required: Input a section number";
          error = true; 
        } else if(section.length !== 5) {
          // Section input not 5 characters long
          document.getElementById("sectionError").textContent = "*Required: Input a 5 digit section number";
          error = true;
        } else if(isNaN(section)) {
          // Section input not a number
          document.getElementById("sectionError").textContent = "*Required: Input a 5 digit section number";
          error = true;
        }
        if(error)
        {
            return false;
        }

        // Adding section to user's profile as student
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

            // If first course, begin array with first section
            if(courses.length === 0)
            {
              await updateDoc(curr, {
                Student:  [section]
              });
            } else
            {
              // Else apply union to previous field and new section
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