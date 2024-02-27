import './App.css'
import axios from "axios"
import { Routes, Route } from "react-router-dom"
import { useEffect,useState } from 'react'
import { useUsers } from './context/UserContext'
import NavBar from "./components/NavBar/NavBar"
import Home from "./pages/Home/Home"
import UserProfile from './pages/UserProfile/UserProfile'
import People from './pages/People/People'
import Person from './pages/Person/Person'
import Logout from './components/Logout'
import AddBirthday from './pages/AddBirthday/AddBirthday'
import EditUserProfile from './pages/EditUserProfile/EditUserProfile'
import WishList from './pages/WishList/WishList'
import Wish from './pages/Wish/Wish'
import EditPerson from './pages/EditPerson/EditPerson'
import CreateWish from './pages/CreateWish/CreateWish'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const { username, setUserFirstName } = useUsers()

  const token = localStorage.getItem("access_token")

  async function fetchData() {
    try {
        const userResponse = await axios.get(`http://localhost:8000/users/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include access token in the request headers
          }
        }
        )
        setUserFirstName(userResponse.data.first_name)
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
    if (isLoggedIn){
      fetchData()
    }
  }, [isLoggedIn])

  return (
    <>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet"/>

      <div className='App container mx-auto sm:max-w-sm lg:max-w-full
      bg-gray-100 px-5 py-5 text-blue-800' data-theme="aqua">
        <NavBar isLoggedIn={ isLoggedIn } />
        <Routes>
          <Route path="/" element={ <Home isLoggedIn={ isLoggedIn } /> } />
          <Route path="/user" element={ <UserProfile isLoggedIn={ isLoggedIn } />} />
          <Route path="/people" element={ <People isLoggedIn={ isLoggedIn } />} />
          <Route path="/people/:id" element={ <Person isLoggedIn={ isLoggedIn } />} />
          <Route path="/editperson/:id" element={ <EditPerson isLoggedIn={ isLoggedIn } />} />
          <Route path="/logout" element={<Logout isLoggedIn={ isLoggedIn } />} />
          <Route path="/addbirthday" element={<AddBirthday isLoggedIn={ isLoggedIn } />} />
          <Route path="/editprofile" element={<EditUserProfile isLoggedIn={ isLoggedIn } />} />
          <Route path="/wishlist/:username" element={<WishList isLoggedIn={ isLoggedIn } />} />
          <Route path="/wishlist/wish/:id" element={<Wish isLoggedIn={ isLoggedIn } />} />
          <Route path="/wishlist/add" element={<CreateWish isLoggedIn={ isLoggedIn } />} />
        </Routes>
      </div>
    </>
  )
}

export default App
