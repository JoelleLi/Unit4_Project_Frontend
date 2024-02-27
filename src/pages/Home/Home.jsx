import { useState, useEffect } from 'react'
import { useUsers } from "../../context/UserContext"
import "./Home.css"
import Login from '../../components/Login'
import SignUp from '../../components/SignUp'
import Calendar from '../../components/Calendar'
import axios from 'axios'


export default function Home({isLoggedIn}) {
  const [showLogin, setShowLogin] = useState(true)
  const { userFirstName, username } = useUsers()

  const toggleComponent = () => {
    setShowLogin(!showLogin)
  }

  // async function fetchData() {
  //   const userProfile = {
  //     user: username,
  //     birthday: null,
  //     image: null,
  //     colours: "",
  //     cake: "",
  //     dietary: "",
  //     flowers: "",
  //     brands: "",
  //     likes_surprises: null,
  //     drinks_alcohol: null
  // }

  // try {
  //   await axios.post(`${process.env.REACT_APP_BACKEND_URL}/userprofile/`, userProfile, {
  //     headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${localStorage.getItem("access_token")}`
  //       },
  //   });
  //   console.log("User profile created successfully")    
  // }
  //   catch (error) {
  //       console.log(error)
  //   }
  // }

  useEffect(() => {
    if (isLoggedIn){
      // fetchData()
      console.log("Logged In")
    }
  }, [isLoggedIn])

  return (
    <div>
      {!isLoggedIn
      ?
      <>
        <div id="welcomeMessage">
          <p>Log in / Sign Up to make wishlists for you and everyone you know.<br/>Never forget a birthday again!</p>
        </div>
        <button className='inline-block px-3 py-1 m-1 rounded-lg  shadow bg-indigo-300 text-white' onClick={toggleComponent}>
          { showLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In" }
        </button>
          { showLogin ? <Login/> : <SignUp /> }
      </>
      :
      <>
        <div>Hello, {userFirstName}</div>
        <Calendar />
      </>
      }
      
    </div>
  )
}
