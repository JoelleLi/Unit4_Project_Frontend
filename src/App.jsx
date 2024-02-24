import './App.css'
import axios from "axios"
import { Routes, Route } from "react-router-dom"
import { useEffect,useState } from 'react'
import { useUsers } from './context/UserContext'
import NavBar from "./components/NavBar"
import Home from "./pages/Home/Home"
import UserProfile from './pages/UserProfile/UserProfile'
import People from './pages/People/People'
import Logout from './components/Logout'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { username, setUserFirstName } = useUsers()

  async function fetchData() {
    try {
        const user = await axios.get(`http://localhost:8000/users/${username}`)
        setUserFirstName(user.data.first_name)
    }
    catch (error) {
        console.log(error)
    }
}

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsLoggedIn(true)
      console.log("Logged in")
    }
    fetchData()
  }, [isLoggedIn])

  return (
    <>
    <div className='container mx-auto'>
      <NavBar isLoggedIn={ isLoggedIn } />
      <Routes>
        <Route path="/" element={ <Home isLoggedIn={ isLoggedIn } /> } />
        <Route path="/user" element={ <UserProfile isLoggedIn={ isLoggedIn } />} />
        <Route path="/people" element={ <People isLoggedIn={ isLoggedIn } />} />
        <Route path="/logout" element={<Logout isLoggedIn={ isLoggedIn } />} />
      </Routes>
    </div>
    </>
  )
}

export default App
