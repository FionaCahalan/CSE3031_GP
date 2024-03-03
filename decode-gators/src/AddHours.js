import './AddHours.css';

function AddHours() {
  return (
    <div className="form">
        <form className = "form" id = "addHoursForm">
            <h2>Add Hours</h2>
            <div class = "question">
                <label for='section'>Section:      </label>
                <input type='number' id='name' autofocus placeholder="12345"></input>
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
            <div class="question">
                <label for='startTime'>Start Time:      </label>
                <input type='time' id='startTime'></input>
            </div>
            <div class = "question">
                <label for='endTime'>End Time:      </label>
                <input type='time' id='end'></input>
            </div>
            <div class = "question">
                <pre id='addDayOfWeek'>Day of the Week:    
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
                </pre>
            </div>
            <input type = "submit" id='submitAddHours'></input>
        </form>
    </div>
  );
}

export default AddHours;
