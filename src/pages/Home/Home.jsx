import { useState, useEffect } from 'react'
import { useUsers } from "../../context/UserContext"
import Login from '../../components/Login'
import SignUp from '../../components/SignUp'
import Calendar from '../../components/Calendar/Calendar'
import axios from 'axios'
import NoticeBoard from '../../components/NoticeBoard/NoticeBoard'


export default function Home({isLoggedIn}) {
  const token = localStorage.getItem("access_token")
  const [showLogin, setShowLogin] = useState(true)
  const [peopleList, setPeopleList] = useState([])
  const [nextBirthdays, setNextBirthdays] = useState()
  const { userFirstName, username } = useUsers()

  useEffect(() => {
    if (isLoggedIn){
      async function fetchData() {
        try {
          const people = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/persons/${username}`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
          setPeopleList(people.data)
          const currentDate = new Date();
          const next30Days = new Date();
          next30Days.setDate(next30Days.getDate() + 30);

          const nextBirthdayList = people.data.filter(person => {
            const birthday = new Date(person.birthday);
            const birthdayMonth = birthday.getMonth();
            const birthdayDay = birthday.getDate();
            const currentMonth = currentDate.getMonth();
            const currentDay = currentDate.getDate();

            // Check if the birthday falls within the next 30 days
            if (
              (birthdayMonth === currentMonth && birthdayDay >= currentDay) ||
              (birthday.getMonth() === next30Days.getMonth() && birthday.getDate() <= next30Days.getDate())
            ) {
              return true;
            }
            return false;
          });

          // console.log("Next Birthdays:", nextBirthdayList);
          setNextBirthdays(nextBirthdayList);
        } catch (error) {
          console.log(error);
        }
      }

      fetchData();
      // console.log("Logged In");
    }
  }, [isLoggedIn, username, token]);

  const toggleComponent = () => {
    setShowLogin(!showLogin)
  }

  return (
    <div>
      {!isLoggedIn
      ?
      <>
        <div className="hero bg-primary">
          <div className="hero-content text-center">
            <div className="max-w-md">
                <h1 className="text-5xl font-bold">What do you want for your birthday?</h1>
                <p className="py-6">Can't remember?<br/>Sign in to make wishlists for you and everyone you know.<br/>Never forget a birthday again!</p>
                <button className="btn btn-base-200" onClick={toggleComponent}>
                { showLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In" }
              </button>
              { showLogin ? <Login/> : <SignUp /> }
            </div>
            
          </div>
        </div>
        {/* <button className='inline-block px-3 py-1 m-1 rounded-lg  shadow bg-indigo-300 text-white' onClick={toggleComponent}>
          { showLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In" }
        </button>
          { showLogin ? <Login/> : <SignUp /> } */}

      </>
      :
      <>
      <div className='p-2'>
        <h5>Hello, <strong>{userFirstName}</strong></h5>
      </div>
        <NoticeBoard nextBirthdays={nextBirthdays} />
        <Calendar peopleList={ peopleList } />
      </>
      }
    </div>
  )
}
