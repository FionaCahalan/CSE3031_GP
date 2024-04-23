import './AddHours.css';
import { useNavigate } from 'react-router-dom';

import { db } from './firebase';

import {increment, getDoc, doc, collection, getDocs, updateDoc, arrayUnion} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
//Compontent for form to add office hours used
function AddHours() {
    let navigate = useNavigate();
    async function check (event)
    {
        //prevent page from reloading
        event.preventDefault();
        
        //Check if user is logged in, if not navigates to login
        const auth = getAuth();
        const user = auth.currentUser;
        if(!user) {
            document.getElementById("loginError").textContent = "Login Before Adding Hours";
            navigate('/login');
            return;
        }
        document.getElementById("loginError").textContent = "";

        var error = false; //Will store and check that all input is valid
        //Checks for valid 5 digit section number
        var section = document.getElementById('section').value;
        section = section.trim();
        document.getElementById("sectionError").textContent = "";
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
        //Checks for an input location
        var newLocation = document.getElementById("location").value;
        newLocation = newLocation.trim();
        document.getElementById("locationError").textContent = "";
        if(newLocation === "")
        {
            document.getElementById("locationError").textContent = "*Required: Input the location of office hours";
            error = true;
        }
        //Checks for an input start time
        var startTime = document.getElementById("startTime").value;
        document.getElementById("startTimeError").textContent = "";
        if(startTime === "")
        {
            document.getElementById("startTimeError").textContent = "*Required: Input the start time";
            error = true; 
        }
        //Checks for an input end time
        var endTime = document.getElementById("endTime").value;
        document.getElementById("endTimeError").textContent = "";
        if(endTime === "")
        {
            document.getElementById("endTimeError").textContent = "*Required: Input the end time";
            error = true;
        }
        //Checks for an input day of week
        var dayOfWeek = document.getElementById("dayOfWeek").value;
        document.getElementById("dayOfWeekError").textContent = "";
        if(dayOfWeek === 'select')
        {
            document.getElementById("dayOfWeekError").textContent = "*Required: Select a day of week";
            error = true; 
        }
        //If any of the input is invalid, it returns false and does not submit the new hour
        if(error)
        {
            return false;
        }
        
        //User has input all valid information
        document.getElementById("submitError").textContent = "";
        var email = user.email;
        //Checks that database has the section number
        const docRef = doc(db, "sectionNumbers", section);
        const docSnap = await getDoc(docRef);
        //If section number exists, continue
        //else prints error message
        if(docSnap.exists())
        {   
            //Checks if user is a professor for the section number
            const profs = await getDocs(collection(db, "sectionNumbers", section, "professors"));
            var added = false;
            profs.forEach(async (d) => {
                //Pulls professors documents for the section. If the id (aka the professor email)
                //matches the user email, then the user is a professor 
                if(d.id === email)
                {
                    added = true;
                    const curr = doc(db, "sectionNumbers", section, "professors", email);
                    //Updates the startTimes, endTimes, locations, and daysOfWeek arrays
                    //All the arrays are indexed the same
                    //ex: index 0 in all of them correlates the start, end time, location, and day of week for an office hour hosted by this user
                    getDoc(curr).then(async (snapshot)=> {
                        const index = snapshot.data().index;
                        const starts = snapshot.data().startTimes;
                        const ends = snapshot.data().endTimes;
                        const days = snapshot.data().daysOfWeek;
                        const locations = snapshot.data().locations;
                        console.log(starts);
                        //If no hours yet, adds the first hour
                        if(index === undefined || index <= 0)
                        {
                            await updateDoc(curr, {
                                "daysOfWeek":  arrayUnion(dayOfWeek),
                                "startTimes": arrayUnion(startTime),
                                "endTimes": arrayUnion(endTime),
                                "locations": arrayUnion(newLocation),
                                index: increment(1)
                            });
                        //Else, add to existing arrays and updates firebase documents
                        } else {
                            const finalStarts = [...starts.slice(0, index), startTime, ...starts.slice(index)];
                            const finalEnds = [...ends.slice(0, index), endTime, ...ends.slice(index)];
                            const finalDaysOfWeek = [...days.slice(0, index), dayOfWeek, ...days.slice(index)];
                            const finalLocations = [...locations.slice(0, index), newLocation, ...locations.slice(index)];
                            await updateDoc(curr, {
                                "daysOfWeek":  finalDaysOfWeek,
                                "startTimes": finalStarts,
                                "endTimes": finalEnds,
                                "locations": finalLocations,
                                index: increment(1)
                            });
                        }
                    });
                }
            });
            //If not added at this point, that means user was not a professor
            //Checks if user is a TA
            if(!added)
            {
                //Pulls all documents for a section number for the ta
                //if any of the document id match the user email, that means the user is a ta
                const tas = await getDocs(collection(docRef, "ta"));
                tas.forEach(async (d) => {
                    if(d.id === email)
                    {
                        added = true;
                        const curr = doc(db, "sectionNumbers", section, "ta", email);
                        //Update arrays in the database with the new hour
                        getDoc(curr).then(async (snapshot)=> {
                            const index = snapshot.data().index;
                            const starts = snapshot.data().startTimes;
                            const ends = snapshot.data().endTimes;
                            const days = snapshot.data().daysOfWeek;
                            const locations = snapshot.data().locations;
                            console.log(starts);
                            if(index === undefined || index === 0)
                            {
                                await updateDoc(curr, {
                                    "daysOfWeek":  arrayUnion(dayOfWeek),
                                    "startTimes": arrayUnion(endTime),
                                    "endTimes": arrayUnion(startTime),
                                    "locations": arrayUnion(newLocation),
                                    index: increment(1)
                                });
                            } else {
                                const finalStarts = [...starts.slice(0, index), startTime, ...starts.slice(index)];
                                const finalEnds = [...ends.slice(0, index), endTime, ...ends.slice(index)];
                                const finalDaysOfWeek = [...days.slice(0, index), dayOfWeek, ...days.slice(index)];
                                const finalLocations = [...locations.slice(0, index), newLocation, ...locations.slice(index)];
                                await updateDoc(curr, {
                                    "daysOfWeek":  finalDaysOfWeek,
                                    "startTimes": finalStarts,
                                    "endTimes": finalEnds,
                                    "locations": finalLocations,
                                    index: increment(1)
                                });
                            }
                        });
                    }
                });
            }
            //If not added, that means the user is not a professor or ta
            //Prints error message
            if(!added)
            {
                document.getElementById("submitError").textContent = "*Permission Denied";
            } else {
                //if hour was added, it clears the form
                document.getElementById("section").value = "";
                document.getElementById("location").value = "";
                document.getElementById("startTime").value = "";
                document.getElementById("endTime").value = "";
                document.getElementById("dayOfWeek").value = "select";

            }
        } else {
            document.getElementById("submitError").textContent = "*Section does not exist";
        }


    };
  return (
    <div className="form">
        
        <form className = "form" id = "addHoursForm" onSubmit={check}>
            <div className = "addHoursInstructions">
                <h2>Add Hours</h2>
                 <p>Add new hours for your course below. Once submitted, they will be automatically reflected the calendars of anyone enrolled in the section.</p>
                 <p id="loginError" className="errorMsg"></p>
            </div>
            <div className = "question">
                <label htmlFor='section'>Section:<pre className="errorMsg" id="sectionError"></pre></label>
                <input type='text' id='section' autoFocus placeholder="12345"></input>
            </div>
            
            <div className = "question">
                <label htmlFor='location'>Location: <pre className="errorMsg" id="locationError"></pre></label>
                <input type='text' id='location' autoFocus placeholder="CSE 2311"></input>
            </div>
            <div className="question time">
                <label htmlFor='startTime'>Start Time: <pre className="errorMsg" id="startTimeError"></pre></label>
                <input type='time' id='startTime'></input>
            </div>
            <div className = "question time">
                <label htmlFor='endTime'>End Time:  <pre className="errorMsg" id="endTimeError"></pre></label>
                <input type='time' id='endTime'></input>
            </div>
            <div className = "question">
                <b>Day of the Week:<pre className="errorMsg" id="dayOfWeekError"></pre> </b>
                <select id="dayOfWeek" name="dayOfWeek">
                    <option value="select">Select</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                </select>
            </div>
            <p className ="errorMsg" id="submitError"></p>
            <input type = "submit" id='submitAddHours'></input>
        </form>
    </div>
  );
}

export default AddHours;
