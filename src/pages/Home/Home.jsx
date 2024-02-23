import React, { useState } from 'react'
import "./Home.css"
import Login from '../../components/Login'
import SignUp from '../../components/SignUp'

export default function Home() {
  const [showLogin, setShowLogin] = useState(true)

  const toggleComponent = () => {
    setShowLogin(!showLogin)
  }

  return (
    <div>
      <div id="welcomeMessage">
        <p>Log in / Sign Up to make wishlists for you and everyone you know.<br/>Never forget a birthday again!</p>
      </div>
      <button onClick={toggleComponent}>
        {showLogin ? "Sign Up" : "Log In"}
      </button>
      { showLogin ? <Login/> : <SignUp /> }
    </div>
  )
}
