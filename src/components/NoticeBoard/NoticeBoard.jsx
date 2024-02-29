// import { Link } from 'react-router-dom'
// import { useEffect, useState } from 'react'
// import { useUsers } from '../../context/UserContext'
// import axios from 'axios'

export default function NoticeBoard({nextBirthdays}) {
    const getMonthName = (monthIndex) => {
        const months = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthIndex];
      }

  return (
    <div className='contentWrapper pb-6'>

      <div className="card bg-primary text-neutral-content p-5">
          {/* <h2 className="card-title">Upcoming Birthdays</h2> */}

          <div className="badge badge-primary-content badge-outline">Upcoming Birthdays</div>

            <img src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7915337/birthday-icon-md.png" alt="" width="40vmin"/>
            <ul className=''>
              {nextBirthdays && nextBirthdays.map((person, index) => {
                const birthdayDate = new Date(person.birthday);
                const currentYear = new Date().getFullYear();
                const age = currentYear - birthdayDate.getFullYear();
                const formattedBirthday = `${person.first_name} will be ${age + 1} on the ${birthdayDate.getDate()}th ${getMonthName(birthdayDate.getMonth())}`;
                
                return (
                  <li className="pt-1 pb-1" key={index}>
                    <div className="badge primary-content badge-outline bg-neutral">{formattedBirthday}</div>
                  </li>
                );
              })}
            </ul>
      </div>
{/* 
      <div className="badge badge-primary badge-outline">Upcoming Birthdays</div>

      <img src="https://creazilla-store.fra1.digitaloceanspaces.com/icons/7915337/birthday-icon-md.png" alt="" width="40vmin"/>
      <ul className=''>
        {nextBirthdays && nextBirthdays.map((person, index) => {
          const birthdayDate = new Date(person.birthday);
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthdayDate.getFullYear();
          const formattedBirthday = `${person.first_name} will be ${age + 1} on the ${birthdayDate.getDate()}th ${getMonthName(birthdayDate.getMonth())}`;
          
          return (
            <li className="pt-1 pb-1" key={index}>
              <div className="badge badge-secondary badge-outline">{formattedBirthday}</div>
            </li>
          );
        })}
      </ul> */}
    </div>
  )
}
