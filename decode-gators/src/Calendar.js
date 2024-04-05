import React, { useState } from 'react';
import './Calendar.css';

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

const Calendar = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

  // Adjusted goToPreviousMonth and goToNextMonth functions
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      const isJanuary = prevMonth === 0;
      if (isJanuary) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11; // December of the previous year
      } else {
        return prevMonth - 1;
      }
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const isDecember = prevMonth === 11;
      if (isDecember) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0; // January of the next year
      } else {
        return prevMonth + 1;
      }
    });
  };

  return (
    <div className="calendar">
      <div className="month-navigation">
        <button onClick={goToPreviousMonth}>&lt; Previous</button>
        <h2>{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}</h2>
        <button onClick={goToNextMonth}>Next &gt;</button>
      </div>
      <div className="weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="week-name">{day}</div>
        ))}
      </div>
      <div className="days-grid">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="day empty"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, day) => (
          <div className="day" key={day}>
            <div className="date">{day + 1}</div>
            {/* Here you can render events for this day */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;




// import React, { useState } from 'react';
// import './Calendar.css';

// const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// // Get the first day of the month
// const getFirstDayOfMonth = (year, month) => {
//   return new Date(year, month, 1).getDay();
// };

// const Calendar = () => {
//   // State for current year and month
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

//   // Calculate the number of days in the month
//   const daysInMonth = getDaysInMonth(currentYear, currentMonth);

//   // Calculate the first day of the month
//   const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

//   // Placeholder for events
//   const events = {/* ... */};

//   // Move to the previous month
//   const goToPreviousMonth = () => {
//     setCurrentMonth((prevMonth) => prevMonth === 0 ? 11 : prevMonth - 1);
//     setCurrentYear((prevYear) => prevMonth === 0 ? prevYear - 1 : prevYear);
//   };

//   // Move to the next month
//   const goToNextMonth = () => {
//     setCurrentMonth((prevMonth) => prevMonth === 11 ? 0 : prevMonth + 1);
//     setCurrentYear((prevYear) => prevMonth === 11 ? prevYear + 1 : prevYear);
//   };

//   // Render the calendar with correct alignment for the first day of the week
//   return (
//     <div className="calendar">
//       <div className="month-navigation">
//         <button onClick={goToPreviousMonth}>&lt; Previous</button>
//         <h2>{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}</h2>
//         <button onClick={goToNextMonth}>Next &gt;</button>
//       </div>
//       <div className="weekdays">
//         {/* Render the days of the week */}
//         {daysOfWeek.map((dayName) => (
//           <div key={dayName} className="week-name">{dayName}</div>
//         ))}
//       </div>
//       <div className="days-grid">
//         {/* Add padding for days before the first day of the month */}
//         {Array.from({ length: firstDayOfMonth }, (_, i) => (
//           <div key={`padding-${i}`} className="day empty"></div>
//         ))}
//         {/* Render each day */}
//         {Array.from({ length: daysInMonth }, (_, day) => (
//           <div className="day" key={day}>
//             <div className="date">{day + 1}</div>
//             {/* Render events for this day */}
//             {/* ... */}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Calendar;