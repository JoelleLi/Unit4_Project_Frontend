import { Link } from 'react-router-dom'

export default function NavBar({isLoggedIn}) {

  return (
    <nav>
      <Link to="/">Home</Link>
      |
      <Link to="/user">My Profile</Link>
      |
      <Link to="/people">Birthday Diary</Link>
      |
      {isLoggedIn ? <Link to="/logout">Log Out</Link> : <Link to="/">Log In</Link> }
    </nav>
  )
}
