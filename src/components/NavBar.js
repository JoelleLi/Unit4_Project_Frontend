import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsLoggedIn(true)
    }
  }, [isLoggedIn])

  return (
    <nav>
      <Link to="/">Home</Link>
      |
      <Link to="/user">My Profile</Link>
      |
      <Link to="/people">Birthday Diary</Link>
      |
      {isLoggedIn ? <Link to="/logout">Log Out</Link> : <p>You're not logged in</p>}
    </nav>
  )
}
