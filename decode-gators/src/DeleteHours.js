import './AddHours.css';
//import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { db } from './firebase';

import {increment, getDoc, doc, collection, getDocs, updateDoc} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
function DeleteHours() {
    let navigate = useNavigate();
    //Checks user is logged in
    //Loads form as well
    async function load ()
    {
        //Get current user account
        const auth = getAuth();
        const user = auth.currentUser;
        //if logged in, continue
        if(user) {
            document.getElementById("loginError").textContent = "";
        } else {
            //If not logged in, navigate to login page
            document.getElementById("loginError").textContent = "Login Before Deleting Hours";
            navigate('/login');
            return;
        } 
        //Gets user email
        var email = user.email;
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);
        //Checks user exists again
        if(docSnap.exists())
        {
            //If the user exists:
            getDoc(docRef).then(async (snapshot)=> {
                //Pull the arrays with the professor and ta section numbers associated with them
                const professor = snapshot.data().Professor;
                const ta = snapshot.data().TA;
                //Create a drop down menu with all the section numbers
                var options = "<option value='select'>Select</option>";
                document.getElementById("hour").innerHTML = options;
                if(professor !== undefined)
                {
                    professor.forEach(element => {
                        options += "<option value= '" + element + "'>" + element + "</option>";
                    });
                }
                if(ta !== undefined)
                {
                    ta.forEach(element => {
                        options += "<option value= '" + element + "'>" + element + "</option>";
                    });
                }
                //Sets the drop down menu
                document.getElementById("sectionNumber").innerHTML = options;
            });
            
        }
    };
    //Once the user selects a section number, this pulls all their hours and generates
    //an hours drop down menu
    //User chooses section and hour to delete 
   async function setHours()
   {
        //Resets error messaging
        document.getElementById("hourError").innerText = "";
        //Pulls section number
        var section = document.getElementById('sectionNumber').value;
        var options;
        //If select, aka no hour chosen, then prints error message and returns
        if(section === 'select')
        {
            options = "<option value='select'>Select</option>";
                document.getElementById("hour").innerHTML = options; 
            document.getElementById("sectionNumberError").innerText ="*Required: Select the section number first";
            return;
        }
        //Resets error message
        document.getElementById("sectionNumberError").innerText ="";
        //Gets user email
        const auth = getAuth();
        const user = auth.currentUser;
        var email = user.email;
        //Pulls the section number selected from database
        const docRef = doc(db, "sectionNumbers", section);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            //Gets all the professors for the section number
            const profs = await getDocs(collection(db, "sectionNumbers", section, "professors"));
            var added = false;
            //Checks if user is professor
            if(profs !== undefined){
                profs.forEach(async (d) => {
                    if(d.id === email)
                    {
                        //User is professor
                        added = true;
                        //Pulls all the hours user offers for section number
                        const curr = doc(db, "sectionNumbers", section, "professors", email);

                        getDoc(curr).then(async (snapshot)=> {
                            const starts = snapshot.data().startTimes;
                            const ends = snapshot.data().endTimes;
                            const days = snapshot.data().daysOfWeek;
                            const locations = snapshot.data().locations;
                            //Prints error if no hours offered for the section number
                            if(starts === undefined || starts.length === 0)
                            {
                                document.getElementById("hourError").innerText = "No hours for this course";
                            } else {
                                //Creates dropdown with all the options to delete
                                options = "<option value='select'>Select</option>";
                                for(var i = 0; i < starts.length; i++)
                                {
                                    options += "<option value= '";
                                    options += i; 
                                    options += "'>";
                                    options += days[i] + " from " + starts[i] + " to " + ends[i] + " at " + locations[i];
                                    options += "</option>";
                                }
                                document.getElementById("hour").innerHTML = options;
                            }
                            return;
                        });
                    }
                });
            }
            //User is not a professor, checks the TA arrays
            if(!added)
            {
                const tas = await getDocs(collection(docRef, "ta"));
                if(tas !== undefined){
                    tas.forEach(async (d) => {
                        if(d.id === email)
                        {
                            //User is a TA for the section number
                            added = true;
                            //Pulls all the hours they offer for the section number
                            const curr = doc(db, "sectionNumbers", section, "ta", email);

                            getDoc(curr).then(async (snapshot)=> {
                                const starts = snapshot.data().startTimes;
                                const ends = snapshot.data().endTimes;
                                const days = snapshot.data().daysOfWeek;
                                const locations = snapshot.data().locations;
                                //If no hours offered, prints error message
                                if(starts === undefined || starts.length === 0)
                                {
                                    document.getElementById("hourError").innerText = "No hours for this course";
                                    return;
                                } else {
                                    //Hours are offered
                                    //Creates dropdown menu with all options of hours to delete for section number
                                    options = "<option value='select'>Select</option>";
                                    
                                    for(var i = 0; i < starts.length; i++)
                                    {
                                        options += "<option value= '";
                                        options += i; 
                                        options += "'>";
                                        options += days[i] + " from " + starts[i] + " to " + ends[i] + " at " + locations[i];
                                        options += "</option>";
                                    }
                                    document.getElementById("hour").innerHTML = options;
                                }
                            });
                            return;
                        }
                    });
                }
            }
            //Not professor or TA
            //Fault prevention, incase database somehow doesn't have updated information
            //Says no hours offered for the section
            if(!added)
            {
                options = "<option value='select'>Select</option>";
                document.getElementById("hour").innerHTML = options; 
                document.getElementById("hourError").innerText = "No hours for this course";
                load();
            }

        } 

   }
   //Updates database to reflect removed hours
   async function removeHour(event)
   {
        //Prevent page reload
        event.preventDefault();
        //Gets the section number
        //Gets the hour selected
        var section = document.getElementById("sectionNumber").value;
        var hour = document.getElementById("hour").value;
        //If either one is still select, print erorr message
        if(section === 'select' || hour === 'select')
        {
            document.getElementById('loginError').innerText = "*Required: Select Section and Hour to Delete";
        }
        //Gets current user
        const auth = getAuth();
        const user = auth.currentUser;
        //Checks they are logged in, if not prints error message and returns
        if(user) {
            document.getElementById("loginError").textContent = "";
        } else {
            document.getElementById("loginError").textContent = "Login Before Deleting Hours";
            return;
        } 
        //Gets user email
        var email = user.email;
        //Pulls the section number suggested
        const docRef = doc(db, "sectionNumbers", section);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            //Checks if the user is a professor for the section number
            const profs = await getDocs(collection(db, "sectionNumbers", section, "professors"));
            var added = false;
            if(profs !== undefined){
                profs.forEach(async (d) => {
                    if(d.id === email)
                    {
                        //User is the professor the for the section number
                        //Pull the office hours they have for this section number
                        added = true;
                        const curr = doc(db, "sectionNumbers", section, "professors", email);

                        //Update the office hours to reflect the removed hour
                        getDoc(curr).then(async (snapshot)=> {
                            const starts = snapshot.data().startTimes;
                            const ends = snapshot.data().endTimes;
                            const days = snapshot.data().daysOfWeek;
                            const locations = snapshot.data().locations;
                            const finalStarts = [...starts.slice(0, hour), ...starts.slice(hour+1)];
                            const finalEnds = [...ends.slice(0, hour), ...ends.slice(hour+1)];
                            const finalDaysOfWeek = [...days.slice(0,hour), ...days.slice(hour+1)];
                            const finalLocations = [...locations.slice(0, hour), ...locations.slice(hour+1)];
                            await updateDoc(curr, {
                                "daysOfWeek":  finalDaysOfWeek,
                                "startTimes": finalStarts,
                                "endTimes": finalEnds,
                                "locations": finalLocations,
                                index: increment(-1)
                            });
                            return;
                        });
                    }
                });
            }
            //If not removed, the checks if user is a TA for the section number
            if(!added)
            {
                const tas = await getDocs(collection(docRef, "ta"));
                if(tas !== undefined){
                    tas.forEach(async (d) => {
                        if(d.id === email)
                        {
                            //User is a TA for the section number
                            //Pulls the office hours the TA hosts for the section number
                            added = true;
                            const curr = doc(db, "sectionNumbers", section, "ta", email);
                            //Updates office hours to reflect removed hours
                            getDoc(curr).then(async (snapshot)=> {
                                const starts = snapshot.data().startTimes;
                                const ends = snapshot.data().endTimes;
                                const days = snapshot.data().daysOfWeek;
                                const locations = snapshot.data().locations;
                                const finalStarts = [...starts.slice(0, hour), ...starts.slice(hour+1)];
                                const finalEnds = [...ends.slice(0, hour), ...ends.slice(hour+1)];
                                const finalDaysOfWeek = [...days.slice(0,hour), ...days.slice(hour+1)];
                                const finalLocations = [...locations.slice(0, hour), ...locations.slice(hour+1)];
                                await updateDoc(curr, {
                                    "daysOfWeek":  finalDaysOfWeek,
                                    "startTimes": finalStarts,
                                    "endTimes": finalEnds,
                                    "locations": finalLocations,
                                    index: increment(-1)
                                });
                                return;
                            });
                        }
                    });
                }
                //Loads the page again with the updated deleted hours
                load();
                return;
            }
        }
        
   }
   //Takes from the welcome delete hours form to the actual delete hours
   //Calls load to check if user is logged in
   //Creates dropdowns with all of the users professor and ta level sections
   function goToDelete()
   {
        document.getElementById("deleteHoursHome").className = "form hide";
        document.getElementById("deleteHoursForm").className = "form";
        load();
   }
  return (
    <div className="form">
        <div className = "form " id="deleteHoursHome">
            <div className = "deleteHoursInstructions">
                <h2>Delete Hours</h2>
                 <p>Search through your current hours and delete the ones you will no longer be hosting. BEWARE: Deleting hours will delete from both your calendar and student's calendars!</p>
                 <p style={{fontSize:15}}>Note: If there are no section options, this means you do not have Professor or TA clearance for any courses. Please contact administration to sort out any issues.</p>
            </div>
            <br />
            <button onClick={goToDelete}>Continue</button>
            <br />
        </div>
        <form className = "form hide" id = "deleteHoursForm" onSubmit={removeHour}>
            <div className = "deleteHoursInstructions">
                <h2>Delete Hours</h2>
                 <p>Search through your current hours and delete the ones you will no longer be hosting. BEWARE: Deleting hours will delete from both your calendar and student's calendars!</p>
                 <p style={{fontSize:15}}>Note: If there are no section options, this means you do not have Professor or TA clearance for any courses. Please contact administration to sort out any issues.</p>
                 <p id="loginError" className="errorMsg"></p>
            </div>
            
            <div className = "question">
                <b>Select a Section #:<pre className="errorMsg" id="sectionNumberError"></pre> </b>
                <select id="sectionNumber" name="sectionNumber" onChange={e => setHours()}>
                    <option value="select">Select</option>
                </select>
                
            </div>
            <div className = "question">
                <b>Select the Hour to Delete:<pre className="errorMsg" id="hourError"></pre> </b>
                <select id="hour" name="hour">
                    <option value="select">Select</option>
                </select>
            </div>
            <p className ="errorMsg" id="submitError"></p>
            <input type = "submit" id='submitDeleteHours'></input>
        </form>
    </div>
  );
}

export default DeleteHours;
