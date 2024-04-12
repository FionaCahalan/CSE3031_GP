import React from 'react';
import './Calendar.css';

const Calendar = () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="calendar">
      <div className="days-grid">
        {daysOfWeek.map(day => (
          <div key={day} className="day">
            <div className="day-name">{day}</div>
            <div className="tasks-grid">
              {Array.from({ length: 1 }).map((_, index) => (
                <div key={index} className="task-box"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
