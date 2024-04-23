import './Admin.css';

import { db } from './firebase';

import { doc, setDoc, getDoc, collection, getDocs, updateDoc, arrayUnion} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
function Admin() {
    //When the user clicks on a form, this checks if the user is an admin
    //If admin, return true
    //if not admin, print error message and return false
    async function loadForm(event)
    {
        //Get the current user
        const auth = getAuth();
        const user = auth.currentUser;
        document.getElementById("formSuccess").textContent = "";
        //If there is a user, check if admin
        //If not print an error message
        if(user) {
            //Checks the admin collection for th user email, if found the user is admin
            var email = user.email;
            const docRef = doc(db, "admin", email);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists())
            {
                //User is admin, return true and remove error message
                document.getElementById("loginError").textContent = "";
                return true;
            } else {
                //User is not admin, print error message
                document.getElementById("loginError").textContent = "ERROR: Not Authorized Admin";
                return false;
            }
        } else {
            //User not logged in, return false and print error message
            document.getElementById("loginError").textContent = "Login Before Deleting Hours";
            return false;
        } 
    }
    //Change to add courses form
    async function goToAddCourses(event)
    {
        //Checks user is logged in and admin
        var ready = await loadForm();
        if(ready)
        {
            //Switches display from home admin, to add courses form
            document.getElementById("buttonsAdmin").className = "form hide";
            document.getElementById("adminAddCourse").className ="form";
        } 
        return;
        
    }
    //Changes to add professor form
    async function goToAddProfessor()
    {
        //Checks user is logged in and admin
        var ready = await loadForm();
        if(ready)
        {
            //Switches to the add courses page
            //Dynamically updates
            //Pulls all the section numbers from the database, generates a dropdown menu
            //with all the different section numbers
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
    //Changes to add teaching assistant form
    async function gotToAddTA(event)
    {
        //Checks user is logged in and admin
        var ready = await loadForm();
        if(ready)
        { 
            //Switches to the add courses page
            //Dynamically updates
            //Pulls all the section numbers from the database, generates a dropdown menu
            //with all the different section numbers
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
    //Changes to add admin form
    async function goToAddAdmin(event)
    {
        //Checks user is logged in and admin
        var ready = await loadForm();
        if(ready)
        {
            //Switches forms displayed
            document.getElementById("buttonsAdmin").className = "form hide";
            document.getElementById("adminAddAdmin").className ="form";
        } 
        return;
        
    }
    //In the add courses form, validates data and sends to database if valid  
    async function submitAddCourses(event)
    {
        //Prevents page reloading
        event.preventDefault();
        //Gets section number and checks that it is valid five digit number
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
        //If input is invalid, return false
        if(error)
        {
            return false; 
        } else {
            //Input is valid, checks if section number is in database
            const docRef = doc(db, "sectionNumbers", section);
            const docSnap = await getDoc(docRef);
            if(!docSnap.exists())
            {  
                //If section number not in database, adds it to the database and prints success message on home admin page
                await setDoc(doc(db, "sectionNumbers", section), {});
                document.getElementById("formSuccess").innerText = "Successfully Added Course!";
            } else {
                //If section number is in database, prints error message on home admin page
                document.getElementById("loginError").innerText = "Section already exists"
            }
            //Switch back to home admin page
            document.getElementById("buttonsAdmin").className = "form";
            document.getElementById("adminAddCourse").className ="form hide";
        }
    }
    //Validates input to add professor form
    async function submitAddProfessor(event)
    {
        //Prevents page reload
        event.preventDefault();
        //Resets error messages
        document.getElementById("addProfessorSectionError").innerText = "";
        document.getElementById("addProfessorEmailError").innerText=""; 
        //Checks if professor email is a valid ufl email
        //if not, prints error message
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
        //Checks that a section number is chosen
        var section = document.getElementById("addProfessorDropdown").value;
        if(section === 'select')
        {
            document.getElementById("addProfessorSectionError").innerText="*Required: Select a Section Number";
            ready = false;
        }
        //If data is invalid, (not ufl email or no section number) returns false
        //User sees error messages and can change responses
        if(!ready)
        {
            return;
        }
        //Checks if professor email exists as a user
        var userDocRef = doc(db, "users", email);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists())
        {
            //If if does, it add the section to the array of their professor sections
            await updateDoc(userDocRef, {
                "Professor": arrayUnion(section)
            });
        } else {
            //If not, it add the email as a new user
            //It then add Professor array and adds the section number
            //When user with matching email creates account, they will be able to access
            //their content as a professor
            await setDoc(doc(db, "users", email), 
            {
                "Professor": [section]
            });
        }
        //Updates the section number database collection to reflect new professor
        const docRef = doc(db, "sectionNumbers", section, "professors", email);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            //If professor already in section, adds error message saying professor already added
            document.getElementById("loginError").innerText = "Professor already in Course Section";
            
        } else {
            //If professor not in section, adds and prints sucess message
            await setDoc(doc(db, "sectionNumbers", section, "professors", email), {});
            document.getElementById("formSuccess").innerText="Success! Professor added to section!";

        }
        //Return to home admin page
        document.getElementById("buttonsAdmin").className = "form";
            document.getElementById("adminAddProfessor").className ="form hide";
    }
    //Validates input for adding a teaching assistant form
    async function submitAddTA(event)
    {
        //Prevents page from reloading
        event.preventDefault();
        //Resets error messages
        document.getElementById("addTASectionError").innerText = "";
        document.getElementById("addTAEmailError").innerText=""; 
        //Checks new TA email is valid ufl email
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
        //Checks that section number is selected
        var section = document.getElementById("addTADropdown").value;
        if(section === 'select')
        {
            document.getElementById("addTASectionError").innerText="*Required: Select a Section Number";
            ready = false;
        }
        //If email or section number invalid, returns with error messsages printed
        if(!ready)
        {
            return;
        }
        //All valid input
        //Checks if teaching assistant email is associated with account
        var userDocRef = doc(db, "users", email);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists())
        {  
            //If it is, updates to add new section as a TA
            await updateDoc(userDocRef, {
                "TA": arrayUnion(section)
            });
        } else {
            //If not, creates new user in database and adds TA section
            await setDoc(doc(db, "users", email), 
            {
                "TA": [section]
            });
        }
        //Updates section number in database to reflect the added TA
        const docRef = doc(db, "sectionNumbers", section, "ta", email);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            //If the TA was already added previously, then prints error message
            document.getElementById("loginError").innerText = "TA already in Course Section";
            
        } else {
            //If able to add a new TA, prints success message
            await setDoc(doc(db, "sectionNumbers", section, "ta", email), {});
            document.getElementById("formSuccess").innerText="Success! TA added to section!";

        }
        //Returns to home admin page
        document.getElementById("buttonsAdmin").className = "form";
        document.getElementById("adminAddTA").className ="form hide";
    }
    //Validates input to add a new admin access acount
    async function submitAddAdmin(event)
    {
        //Prevent page reload
        event.preventDefault();
        //Resets error message
        document.getElementById("addAdminError").innerText = "";
        //Checks email is a valid ufl email
        var email = document.getElementById("addAdminEmail").value;
        if(email.length <= 8 || email.substring(email.length-8) !== "@ufl.edu")
        {
            document.getElementById("addAdminError").innerText = "*Required: Add valid UFL email";
            return false;
        }
        //If email is valid, checks if already admin
        const docRef = doc(db, "admin", email);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            //If already admin, prints error message
            document.getElementById("loginError").innerText = "User already has admin level access.";
        } else {
            //If not, updates database to reflect new admin account
            await setDoc(doc(db, "admin", email), {});
            document.getElementById("formSuccess").innerText = email + " add successfully to admin level access.";
        }
        //Switches back to home admin page
        document.getElementById("buttonsAdmin").className = "form";
        document.getElementById("adminAddAdmin").className = "form hide";
        return true;
    }
    //All forms have a back button
    //This button calls the back() function
    //It takes the admin back to the home admin page with all the forms linked
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
