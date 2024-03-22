import './AddHours.css';

function AddHours() {
    
  return (
    <div className="form">
        <form className = "form" id = "addHoursForm">
            <h2>Add Hours</h2>
            <p>Add new hours for your course below. Once submitted, they will be automatically reflected the calendars of anyone enrolled in the section.</p>
            <div class = "question">
                <p class="errorMsg" id="sectionError"></p>
                <label for='section'>Section:      </label>
                <input type='number' id='section' autofocus placeholder="12345"></input>
            </div>
            <div class = "question">
                Who is adding hours? 
                <input type="radio" id="profAddHours" name="whoAddHours" value="prof"></input>
                <label for="profAddHours">Professor</label>
                <input type="radio" id="taAddHours" name="whoAddHours" value="ta"></input>
                <label for="taAddHours">TA</label>
            </div>
            <div class = "question">
                <label for='name'>Name:      </label>
                <input type='text' id='name' autofocus placeholder="Albert"></input>
            </div>
            <div class = "question">
                <label for='location'>Location:      </label>
                <input type='text' id='location' autofocus placeholder="CSE 2311"></input>
            </div>
            <div class="question time">
                <label for='startTime'>Start Time:      </label>
                <input type='time' id='startTime'></input>
            </div>
            <div class = "question time">
                <label for='endTime'>End Time:      </label>
                <input type='time' id='end'></input>
            </div>
            <div class = "question">
                Day of the Week:    
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
            <input type = "submit" id='submitAddHours'></input>
        </form>
    </div>
  );
}

export default AddHours;
