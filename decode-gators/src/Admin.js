import './Admin.css';

//import { db } from './firebase';

//import {increment, getDoc, doc, collection, getDocs, updateDoc, arrayUnion} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
function Admin() {
    async function loadForm()
    {
        const auth = getAuth();
        const user = auth.currentUser;
        if(user) {
            document.getElementById("loginError").textContent = "";
            console.log(user.email);
        } else {
            document.getElementById("loginError").textContent = "Login Before Deleting Hours";
            return;
        } 
    }
  return (
    <div className="admin">
        <h3 id="adminInstructions">Admin</h3>
        <p style={{fontSize:18}}>Below are links to the administrative forms.</p>
        <div id='buttonsAdmin' className="form">
            <p className="errorMsg" id="loginError"></p>
            <button id="addCourses" onClick={loadForm}>Add Courses</button>
            <button id="addProfessor" onClick={loadForm}>Add Professor to Course</button>
            <button id="addTA" onClick={loadForm}>Add TA/PM to Course</button>
            <button id="addAdmin" onClick={loadForm}>Add Other Admin</button>
            <br />
        </div>
        
    </div>
  );
}

export default Admin;
