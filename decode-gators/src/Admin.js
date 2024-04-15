import './Admin.css';

import { db } from './firebase';

import { doc, setDoc, getDoc, collection, getDocs, updateDoc, arrayUnion} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
function Admin() {
    async function loadForm(event)
    {

        const auth = getAuth();
        const user = auth.currentUser;
        document.getElementById("formSuccess").textContent = "";

        if(user) {
            var email = user.email;
            const docRef = doc(db, "admin", email);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists())
            {
                document.getElementById("loginError").textContent = "";
                return true;
            } else {
                document.getElementById("loginError").textContent = "ERROR: Not Authorized Admin";
                return false;
            }
        } else {
            document.getElementById("loginError").textContent = "Login Before Deleting Hours";
            return false;
        } 
    }
    async function goToAddCourses(event)
    {
        
        var ready = await loadForm();
        if(ready)
        {
            
            document.getElementById("buttonsAdmin").className = "form hide";
            document.getElementById("adminAddCourse").className ="form";
        } 
        return;
        
    }
    async function goToAddProfessor()
    {
        
        var ready = await loadForm();
        if(ready)
        {
            var options = "<option value='select'>Select</option>";
            const querySnapshot = await getDocs(collection(db, "sectionNumbers"));
            querySnapshot.forEach((doc) => {
                options += "<option value='" + doc.id + "'>" + doc.id + "</option>";
            });
            document.getElementById("addProfessorEmail").value = "";
            document.getElementById("addProfessorDropdown").innerHTML = options;
            document.getElementById("buttonsAdmin").className = "form hide";
            document.getElementById("adminAddProfessor").className ="form";
        } 
        return;
        
    }
    async function gotToAddTA(event)
    {
        
        var ready = await loadForm();
        if(ready)
        {
            var options = "<option value='select'>Select</option>";
            const querySnapshot = await getDocs(collection(db, "sectionNumbers"));
            querySnapshot.forEach((doc) => {
                options += "<option value='" + doc.id + "'>" + doc.id + "</option>";
            });
            document.getElementById("addTAEmail").value = "";
            document.getElementById("addTADropdown").innerHTML = options;
            document.getElementById("buttonsAdmin").className = "form hide";
            document.getElementById("adminAddTA").className ="form";
        } 
        return;
        
    }
    async function goToAddAdmin(event)
    {
        
        var ready = await loadForm();
        if(ready)
        {
            document.getElementById("buttonsAdmin").className = "form hide";
            document.getElementById("adminAddAdmin").className ="form";
        } 
        return;
        
    }
    async function submitAddCourses(event)
    {
        event.preventDefault();
        var section = document.getElementById('addSectionNumber').value;
        section = section.trim();
        var error;
        document.getElementById("addSectionError").textContent = "";
        if(section === "")
        {
            document.getElementById("addSectionError").textContent = "*Required: Input a section number";
            error = true; 
        } else if(section.length !== 5) {
            document.getElementById("addSectionError").textContent = "*Required: Input a 5 digit section number";
             error = true;
        } else if(isNaN(section)) {
            document.getElementById("addSectionError").textContent = "*Required: Input a 5 digit section number";
             error = true;
        }
        if(error)
        {
            return false; 
        } else {
            const docRef = doc(db, "sectionNumbers", section);
            const docSnap = await getDoc(docRef);
            if(!docSnap.exists())
            {
                await setDoc(doc(db, "sectionNumbers", section), {});
                document.getElementById("formSuccess").innerText = "Successfully Added Course!";
            } else {
                document.getElementById("loginError").innerText = "Section already exists"
            }
            
            document.getElementById("buttonsAdmin").className = "form";
            document.getElementById("adminAddCourse").className ="form hide";
        }
    }
    async function submitAddProfessor(event)
    {
        event.preventDefault();
        document.getElementById("addProfessorSectionError").innerText = "";
        document.getElementById("addProfessorEmailError").innerText=""; 
        var email = document.getElementById("addProfessorEmail").value;
        var ready = true;
        if(email.length <= "@ufl.edu".length)
        {
            document.getElementById("addProfessorEmailError").innerText="*Required: Input valid UFL Email"; 
            ready = false;
        } else {
            var e = email.substring(email.length-8);
            if(e !== "@ufl.edu")
            {
                document.getElementById("addProfessorEmailError").innerText="*Required: Input valid UFL Email"; 
                ready = false;
            }
        }
        var section = document.getElementById("addProfessorDropdown").value;
        if(section === 'select')
        {
            document.getElementById("addProfessorSectionError").innerText="*Required: Select a Section Number";
            ready = false;
        }
        if(!ready)
        {
            return;
        }

        var userDocRef = doc(db, "users", email);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists())
        {
            await updateDoc(userDocRef, {
                "Professor": arrayUnion(section)
            });
        } else {
            await setDoc(doc(db, "users", email), 
            {
                "Professor": [section]
            });
        }

        const docRef = doc(db, "sectionNumbers", section, "professors", email);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            document.getElementById("loginError").innerText = "Professor already in Course Section";
            
        } else {
            await setDoc(doc(db, "sectionNumbers", section, "professors", email), {});
            document.getElementById("formSuccess").innerText="Success! Professor added to section!";

        }
        document.getElementById("buttonsAdmin").className = "form";
            document.getElementById("adminAddProfessor").className ="form hide";
    }
    async function submitAddTA(event)
    {
        event.preventDefault();
        document.getElementById("addTASectionError").innerText = "";
        document.getElementById("addTAEmailError").innerText=""; 
        var email = document.getElementById("addTAEmail").value;
        var ready = true;
        if(email.length <= "@ufl.edu".length)
        {
            document.getElementById("addTAEmailError").innerText="*Required: Input valid UFL Email"; 
            ready = false;
        } else {
            var e = email.substring(email.length-8);
            if(e !== "@ufl.edu")
            {
                document.getElementById("addTAEmailError").innerText="*Required: Input valid UFL Email"; 
                ready = false;
            }
        }
        var section = document.getElementById("addTADropdown").value;
        if(section === 'select')
        {
            document.getElementById("addTASectionError").innerText="*Required: Select a Section Number";
            ready = false;
        }
        if(!ready)
        {
            return;
        }

        var userDocRef = doc(db, "users", email);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists())
        {
            await updateDoc(userDocRef, {
                "TA": arrayUnion(section)
            });
        } else {
            await setDoc(doc(db, "users", email), 
            {
                "TA": [section]
            });
        }

        const docRef = doc(db, "sectionNumbers", section, "ta", email);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            document.getElementById("loginError").innerText = "TA already in Course Section";
            
        } else {
            await setDoc(doc(db, "sectionNumbers", section, "ta", email), {});
            document.getElementById("formSuccess").innerText="Success! TA added to section!";

        }
        document.getElementById("buttonsAdmin").className = "form";
        document.getElementById("adminAddTA").className ="form hide";
    }
    async function submitAddAdmin(event)
    {
        event.preventDefault();
        document.getElementById("addAdminError").innerText = "";
        var email = document.getElementById("addAdminEmail").value;
        if(email.length <= 8 || email.substring(email.length-8) !== "@ufl.edu")
        {
            document.getElementById("addAdminError").innerText = "*Required: Add valid UFL email";
            return false;
        }
        const docRef = doc(db, "admin", email);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            document.getElementById("loginError").innerText = "User already has admin level access.";
        } else {
            await setDoc(doc(db, "admin", email), {});
            document.getElementById("formSuccess").innerText = email + " add successfully to admin level access.";
        }
        document.getElementById("buttonsAdmin").className = "form";
        document.getElementById("adminAddAdmin").className = "form hide";
        return true;
    }
    async function back()
    {
        document.getElementById("buttonsAdmin").className = "form";
        document.getElementById("adminAddCourse").className ="form hide";
        document.getElementById("adminAddProfessor").className = "form hide";
        document.getElementById("adminAddTA").className = "form hide";
        document.getElementById("adminAddAdmin").className = "form hide";

    }
  return (
    <div className="admin">
        <div id='buttonsAdmin' className="form">
            <h3 id="adminInstructions">Admin</h3>
            <p style={{fontSize:18}}>Below are links to the administrative forms.</p>
            <p className="errorMsg" id="loginError"></p>
            <p className="successMsg" id="formSuccess"></p>
            <button id="addCourses" onClick={goToAddCourses}>Add Courses</button>
            <button id="addProfessor" onClick={goToAddProfessor}>Add Professor to Course</button>
            <button id="addTA" onClick={gotToAddTA}>Add TA/PM to Course</button>
            <button id="addAdmin" onClick={goToAddAdmin}>Add Other Admin</button>
            <br />
        </div>

        <div id="adminAddCourse" className="form hide">
            <form className = "form" id = "addHoursForm"  onSubmit={submitAddCourses}>

                <h3>Add Courses</h3>
                <p>Add courses available for office hours below</p><br />
                <p className="errorMsg" id="addSectionError"></p>
                <label htmlFor='addSectionNumber'> 5 digit Section Number: </label>
                <input type="text" id="addSectionNumber" autoFocus placeholder='12345'></input><br/>
                <input type="submit" className="submitButton" id="submitAddSection"></input><br/>
            </form>
            <button onClick={back}>Back</button>
        </div>
        <div id="adminAddProfessor" className="form hide">
            <h3>Add Professors to Course</h3>
            <p>Add professors to their courses via email</p><br />
            <form className="form" id="addProfessorForm"  onSubmit={submitAddProfessor}>
                <p className="errorMsg" id="addProfessorSectionError"></p> 
                Select a Course Section: 
                <select id="addProfessorDropdown">
                    <option value="select">Select</option>
                </select>
                <br />
                <p className="errorMsg" id="addProfessorEmailError"></p>
                <label htmlFor='addProfessorEmail'> Add by Ufl Email: </label>
                <input type="text" id="addProfessorEmail" autoFocus placeholder='albert@ufl.edu'></input><br/>
                <input type="submit" className="submitButton" id="submitAddProfessor"></input><br/>
            </form>
            <button onClick={back}>Back</button>

        </div>
        <div id="adminAddTA" className="form hide">
            <h3>Add TA/PM to Course</h3>
            <p>Add Teaching Assistants and Peer Mentors to their courses via email</p><br />
            <form className="form" id="addTAForm"  onSubmit={submitAddTA}>
                <p className="errorMsg" id="addTASectionError"></p> 
                Select a Course Section: 
                <select id="addTADropdown">
                    <option value="select">Select</option>
                </select>
                <br />
                <p className="errorMsg" id="addTAEmailError"></p>
                <label htmlFor='addTAEmail'> Add by Ufl Email: </label>
                <input type="text" id="addTAEmail" autoFocus placeholder='albert@ufl.edu'></input><br/>
                <input type="submit" className="submitButton" id="submitAddTA"></input><br/>
            </form>
            <button onClick={back}>Back</button>

        </div>
        <div id="adminAddAdmin" className="form hide">
            <form className = "form" id = "addHoursForm" onSubmit={submitAddAdmin}>
                <h3>Add Admin</h3>
                <p>Give other people ADMIN LEVEL ACCESS via UFL email</p><br />
                <p className="errorMsg" id="addAdminError"></p>
                <label htmlFor='addAdminEmail'> New Admin's UFL Email: </label>
                <input type="text" id="addAdminEmail" autoFocus placeholder='alberta@ufl.edu'></input><br/>
                <input type="submit" className="submitButton" id="submitAdminSection" ></input><br/>
            </form>
            <button onClick={back}>Back</button>

        </div>
        
    </div>
  );
}

export default Admin;
