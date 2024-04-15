import React, { useEffect, useState } from 'react';
import './Calendar.css';
import { db } from './firebase'; // Ensure this path is correct
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const Calendar = () => {
  const [officeHours, setOfficeHours] = useState({});
  const testEmail = "sofia.lynch@ufl.edu"; // Hardcoded for testing

  useEffect(() => {
    async function fetchUserDataAndSections() {
      console.log("Attempting to fetch user data for:", testEmail);
      const userRef = doc(db, "users", testEmail);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        console.log("Document found, data:", docSnap.data());
        const userData = docSnap.data();
        const sections = [...new Set([...userData.Professor, ...userData.Student, ...userData.TA])];
        console.log("Sections extracted from user data:", sections);
        
        
        async function fetchOfficeHours(sections) {
          let allHoursData = {
            'Sunday': [], 'Monday': [], 'Tuesday': [], 'Wednesday': [],
            'Thursday': [], 'Friday': [], 'Saturday': []
          };
      
          for (const section of sections) {
            // Fetch from professors subcollection
            await fetchSubCollectionHours(section, "professors", allHoursData);
            // Fetch from TAs subcollection
            await fetchSubCollectionHours(section, "TAs", allHoursData);
          }
      
          console.log("All office hours data:", allHoursData);  // Log the final structure of allHoursData
          setOfficeHours(allHoursData);
        }
        
        
        fetchOfficeHours(sections);
      } else {
        console.error("No document found for the user:", testEmail);
      }
    }

    fetchUserDataAndSections();
  }, []);

  async function fetchSubCollectionHours(section, subcollection, allHoursData) {
    const ref = collection(db, "sectionNumbers", section, subcollection);
    const snap = await getDocs(ref);
    
    snap.forEach(doc => {
      const data = doc.data();
      if (data.daysOfWeek && Array.isArray(data.daysOfWeek) &&
          data.startTimes && Array.isArray(data.startTimes) &&
          data.endTimes && Array.isArray(data.endTimes) &&
          data.locations && Array.isArray(data.locations)) {
        data.daysOfWeek.forEach((day, index) => {
          if (!allHoursData[day]) allHoursData[day] = [];
          allHoursData[day].push({
            role: subcollection.slice(0, -1),  // "professors" -> "professor", "TAs" -> "TA"
            name: doc.id,  // Assuming doc.id might be used to identify the professor/TA
            startTime: data.startTimes[index],
            endTime: data.endTimes[index],
            location: data.locations[index]
          });
        });
      } else {
        console.error(`Data issue in ${subcollection} for section ${section}:`, data);
      }
    });
  }

  return (
    <div className="calendar">
      {Object.entries(officeHours).map(([day, hours]) => (
        <div key={day} className="day">
          <div className="day-name">{day}</div>
          {hours.length > 0 ? hours.map((hour, index) => (
            <div key={index} className="task-box">
              {hour.role}: {hour.name}<br />
              Time: {hour.startTime} - {hour.endTime}<br />
              Location: {hour.location}
            </div>
          )) : <div className="task-box">No office hours scheduled.</div>}
        </div>
      ))}
    </div>
  );
};

export default Calendar;


