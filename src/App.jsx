import './App.css'
import axios from "axios"
import { Routes, Route } from "react-router-dom"
import { useEffect,useState } from 'react'
import { useUsers } from './context/UserContext'
import NavBar from "./components/NavBar/NavBar"
import Home from "./pages/Home/Home"
import About from './pages/About/About'
import UserProfile from './pages/UserProfile/UserProfile'
import People from './pages/People/People'
import Person from './pages/Person/Person'
import Logout from './components/Logout'
import AddBirthday from './pages/AddBirthday/AddBirthday'
import EditUserProfile from './pages/EditUserProfile/EditUserProfile'
import WishList from './pages/WishList/WishList'
import WishListPerson from './pages/WishList/WishListPerson'
import Wish from './pages/Wish/Wish'
import EditPerson from './pages/EditPerson/EditPerson'
import CreateWish from './pages/CreateWish/CreateWish'
import CreateWishPerson from './pages/CreateWish/CreateWishPerson'
import EditWish from './pages/EditWish/EditWish'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { setUserFirstName, setUserDetails, userDetails, username } = useUsers()

  // const token = localStorage.getItem("access_token")
  async function fetchData() {
    try {
        const userResponse = await axios.get(`http://localhost:8000/users/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}` // Include access token in the request headers
          }
        }
        )
        setUserFirstName(userResponse.data.first_name)
        setUserDetails(userResponse.data)
        // console.log(userResponse.data)
        
    }
    catch (error) {
        console.log(error)
    }
}

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setIsLoggedIn(true)
      // console.log("Logged in")
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  return (
  <div className='App container mt-5'>
    <NavBar isLoggedIn={ isLoggedIn } />
      <div className="contentWrapper container w-80 md:w-auto mx-auto">
      <Routes>
        <Route path="/" element={ <Home isLoggedIn={ isLoggedIn } /> } />
        <Route path="/about" element={ <About isLoggedIn={ isLoggedIn } /> } />
        <Route path="/user/:username" element={ <UserProfile isLoggedIn={ isLoggedIn } />} />
        <Route path="/people" element={ <People isLoggedIn={ isLoggedIn } />} />
        <Route path="/people/:id" element={ <Person isLoggedIn={ isLoggedIn } userDetails={userDetails} />} />
        <Route path="/editperson/:id" element={ <EditPerson isLoggedIn={ isLoggedIn } userDetails={userDetails}/>} />
        <Route path="/logout" element={<Logout isLoggedIn={ isLoggedIn } />} />
        <Route path="/addbirthday" element={<AddBirthday isLoggedIn={ isLoggedIn } userDetails={ userDetails } />} />
        <Route path="/editprofile" element={<EditUserProfile isLoggedIn={ isLoggedIn } userDetails={ userDetails } />} />
        <Route path="/wishlist/:username" element={<WishList isLoggedIn={ isLoggedIn } />} />
        <Route path="/wishlist/person/:id" element={<WishListPerson isLoggedIn={ isLoggedIn } />} />
        <Route path="/wishlist/wish/:username/:id" element={<Wish isLoggedIn={ isLoggedIn } />} />
        <Route path="/wishlist/wish/:id" element={<Wish isLoggedIn={ isLoggedIn } />} />
        <Route path="/wishlist/add" element={<CreateWish isLoggedIn={ isLoggedIn } userDetails={ userDetails }/>} />
        <Route path="/wishlist/person/add" element={<CreateWishPerson isLoggedIn={ isLoggedIn } userDetails={ userDetails }/>} />
        <Route path="/wish/edit/:username/:id" element={<EditWish isLoggedIn={ isLoggedIn } userDetails={ userDetails }/>} />
      </Routes>
      </div>
  </div>
  )
}

export default App
