import React, { useState } from 'react'
import { useUsers } from "../../context/UserContext"
import "./Home.css"
import Login from '../../components/Login'
import SignUp from '../../components/SignUp'
import Calendar from '../../components/Calendar'


export default function Home({isLoggedIn}) {
  const [showLogin, setShowLogin] = useState(true)
  const { userFirstName } = useUsers()

  const toggleComponent = () => {
    setShowLogin(!showLogin)
  }

  return (
    <div>
      {!isLoggedIn
      ?
      <>
        <div id="welcomeMessage">
          <p>Log in / Sign Up to make wishlists for you and everyone you know.<br/>Never forget a birthday again!</p>
        </div>
        <button onClick={toggleComponent}>
          { showLogin ? "Sign Up" : "Log In" }
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
