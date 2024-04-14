import './AddHours.css';
//import { useEffect } from 'react';

import { db } from './firebase';

import {increment, getDoc, doc, collection, getDocs, updateDoc} from 'firebase/firestore';

import { getAuth } from 'firebase/auth';
function DeleteHours() {
    
    async function load ()
    {
        const auth = getAuth();
        const user = auth.currentUser;
        if(user) {
            document.getElementById("loginError").textContent = "";
            console.log(user.email);
        } else {
            console.log('here');
            document.getElementById("loginError").textContent = "Login Before Deleting Hours";
            return;
        } 
        var email = user.email;
        const docRef = doc(db, "users", email);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            getDoc(docRef).then(async (snapshot)=> {
                const professor = snapshot.data().Professor;
                const ta = snapshot.data().TA;
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
                document.getElementById("sectionNumber").innerHTML = options;
            });
            
        }
    };

   async function setHours()
   {
        document.getElementById("hourError").innerText = "";
        var section = document.getElementById('sectionNumber').value;
        var options;
        if(section === 'select')
        {
            options = "<option value='select'>Select</option>";
                document.getElementById("hour").innerHTML = options; 
            document.getElementById("sectionNumberError").innerText ="*Required: Select the section number first";
            return;
        }
        document.getElementById("sectionNumberError").innerText ="";
        const auth = getAuth();
        const user = auth.currentUser;
        var email = user.email;
        const docRef = doc(db, "sectionNumbers", section);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            const profs = await getDocs(collection(db, "sectionNumbers", section, "professors"));
            var added = false;
            if(profs !== undefined){
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
                            if(index === undefined || index === 0)
                            {
                                document.getElementById("hourError").innerText = "No hours for this course";
                            } else {
                                options = "<option value='select'>Select</option>";
                                for(var i = 0; i < index; i++)
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
            if(!added)
            {
                const tas = await getDocs(collection(docRef, "ta"));
                if(tas !== undefined){
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
                                if(index === undefined || index === 0)
                                {
                                    document.getElementById("hourError").innerText = "No hours for this course";
                                    return;
                                } else {
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
            if(!added)
            {
                options = "<option value='select'>Select</option>";
                document.getElementById("hour").innerHTML = options; 
                document.getElementById("hourError").innerText = "No hours for this course";
                load();
            }

        } 

   }

   async function removeHour(event)
   {
        event.preventDefault();

        var section = document.getElementById("sectionNumber").value;
        var hour = document.getElementById("hour").value;
        if(section === 'select' || hour === 'select')
        {
            document.getElementById('loginError').innerText = "*Required: Select Section and Hour to Delete";
        }
        const auth = getAuth();
        const user = auth.currentUser;
        if(user) {
            document.getElementById("loginError").textContent = "";
        } else {
            document.getElementById("loginError").textContent = "Login Before Deleting Hours";
            return;
        } 
        var email = user.email;
        const docRef = doc(db, "sectionNumbers", section);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            const profs = await getDocs(collection(db, "sectionNumbers", section, "professors"));
            var added = false;
            if(profs !== undefined){
                profs.forEach(async (d) => {
                    if(d.id === email)
                    {
                        added = true;
                        const curr = doc(db, "sectionNumbers", section, "professors", email);

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
            if(!added)
            {
                const tas = await getDocs(collection(docRef, "ta"));
                if(tas !== undefined){
                    tas.forEach(async (d) => {
                        if(d.id === email)
                        {
                            added = true;
                            const curr = doc(db, "sectionNumbers", section, "ta", email);

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
                load();
                return;
            }
        }
        
   }
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
