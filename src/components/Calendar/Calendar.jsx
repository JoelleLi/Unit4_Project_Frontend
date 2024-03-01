import './Calendar.css'
import React, { useState, useEffect } from 'react';

export default function Calendar({ peopleList }) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [days, setDays] = useState([]);

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ]

  const renderDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const lastDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayOfMonth; i > 0; i--) {
      liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateOfMonth; i++) {
      const isToday = i === new Date().getDate() && currentMonth === new Date().getMonth() 
      && currentYear === new Date().getFullYear() ? "active" : "";
      liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = new Date(currentYear, currentMonth, lastDateOfMonth).getDay(); i < 6; i++) {
      liTag += `<li class="inactive">${i - lastDateOfMonth + 1}</li>`;
    }

    setDays(liTag);
  };

  const prevMonth = () => {
    setCurrentMonth(prevMonth => prevMonth - 1);
    if (currentMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(prevMonth => prevMonth + 1);
    if (currentMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    }
  };

  useEffect(() => {
    renderDays()
    console.log(peopleList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentYear, currentMonth]);

  return (
    <div>
      <div className="wrapper">
        <header>
          <h4>{`${months[currentMonth]} ${currentYear}`}</h4>
          <div className="icons">
            <span className="material-symbols-rounded" onClick={prevMonth}>
            &#x3c;
            </span>
            <span className="material-symbols-rounded" onClick={nextMonth}>
            &#x3e;
            </span>
          </div>
        </header>
        <div className="calendar">
          <ul className="weeks">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <ul className="days" dangerouslySetInnerHTML={{ __html: days }}></ul>
        </div>
      </div>
    </div>
  );
};
