import './AddHours.css';

import { db } from './firebase';
import { getDoc, doc, collection, setDoc, getDocs, updateDoc, arrayUnion} from 'firebase/firestore';
function AddHours() {
    async function check (event)
    {
        event.preventDefault();
        
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
        var email = document.getElementById("name").value;
        const docRef = doc(db, "sectionNumbers", section);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists())
        {
            const profs = await getDocs(collection(docRef, "professors"));
            var added = false;
            profs.forEach(async (d) => {
                if(d.id === email)
                {
                    added = true;
                    const curr = doc(db, "sectionNumbers", section, "professors", email);
                    console.log(curr.id);
                    await updateDoc(curr, {
                        "day":  arrayUnion(dayOfWeek),
                        "hourEnd": arrayUnion(endTime),
                        "hourStart": arrayUnion(startTime),
                        "location": arrayUnion(newLocation),
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
                        await updateDoc(curr, {
                            "day":  arrayUnion(dayOfWeek),
                            "hourEnd": arrayUnion(endTime),
                            "hourStart": arrayUnion(startTime),
                            "location": arrayUnion(newLocation),
                        });
                    }
                });
            }
            if(!added)
            {
                document.getElementById("submitError").textContent = "*Permission Denied";
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
            </div>
            <div className = "question">
                <label htmlFor='section'>Section:<pre className="errorMsg" id="sectionError"></pre></label>
                <input type='text' id='section' autoFocus placeholder="12345"></input>
            </div>
            <div className = "question">
                Who is adding hours? 
                <input type="radio" id="profAddHours" name="whoAddHours" value="prof"></input>
                <label htmlFor="profAddHours">Professor</label>
                <input type="radio" id="taAddHours" name="whoAddHours" value="ta"></input>
                <label htmlFor="taAddHours">TA</label>
            </div>
            <div className = "question">
                <label htmlFor='name'>Name:      </label>
                <input type='text' id='name' autoFocus placeholder="Albert"></input>
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
                    <option value="sunday">Sunday</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                </select>
            </div>
            <p className ="errorMsg" id="submitError"></p>
            <input type = "submit" id='submitAddHours'></input>
        </form>
    </div>
  );
}

export default AddHours;
