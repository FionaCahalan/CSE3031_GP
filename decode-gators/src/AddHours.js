import './AddHours.css';

import { db } from './firebase';

import {increment, getDoc, doc, collection, getDocs, updateDoc, arrayUnion} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
function AddHours() {
    async function check (event)
    {
        event.preventDefault();
        
        const auth = getAuth();
        const user = auth.currentUser;
        if(!user) {
            document.getElementById("loginError").textContent = "Login Before Adding Hours";
            return;
        }
        document.getElementById("loginError").textContent = "";

        var error = false;
        
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

        var newLocation = document.getElementById("location").value;
        newLocation = newLocation.trim();
        document.getElementById("locationError").textContent = "";
        if(newLocation === "")
        {
            document.getElementById("locationError").textContent = "*Required: Input the location of office hours";
            error = true;
        }

        var startTime = document.getElementById("startTime").value;
        document.getElementById("startTimeError").textContent = "";
        if(startTime === "")
        {
            document.getElementById("startTimeError").textContent = "*Required: Input the start time";
            error = true; 
        }

        var endTime = document.getElementById("endTime").value;
        document.getElementById("endTimeError").textContent = "";
        if(endTime === "")
        {
            document.getElementById("endTimeError").textContent = "*Required: Input the end time";
            error = true;
        }

        var dayOfWeek = document.getElementById("dayOfWeek").value;
        document.getElementById("dayOfWeekError").textContent = "";
        if(dayOfWeek === 'select')
        {
            document.getElementById("dayOfWeekError").textContent = "*Required: Select a day of week";
            error = true; 
        }
        if(error)
        {
            return false;
        }
        
        document.getElementById("submitError").textContent = "";
        var email = user.email;
        const docRef = doc(db, "sectionNumbers", section);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            const profs = await getDocs(collection(db, "sectionNumbers", section, "professors"));
            var added = false;
            profs.forEach(async (d) => {
                if(d.id === email)
                {
                    added = true;
                    const curr = doc(db, "sectionNumbers", section, "professors", email);

                    getDoc(curr).then(async (snapshot)=> {
                        const index = snapshot.data().index;
                        const starts = snapshot.data().startTimes;
                        const ends = snapshot.data().endTimes;
                        const days = snapshot.data().daysOfWeek;
                        const locations = snapshot.data().locations;
                        console.log(starts);
                        if(index === undefined || index <= 0)
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

            if(!added)
            {
                const tas = await getDocs(collection(docRef, "ta"));
                tas.forEach(async (d) => {
                    if(d.id === email)
                    {
                        added = true;
                        const curr = doc(db, "sectionNumbers", section, "ta", email);
    
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
            if(!added)
            {
                document.getElementById("submitError").textContent = "*Permission Denied";
            } else {
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
