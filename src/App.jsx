import './App.css'
import { Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./pages/Home/Home"
import UserProfile from './pages/UserProfile/UserProfile'
import People from './pages/People/People'
import Logout from './components/Logout'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/user" element={ <UserProfile />} />
        <Route path="/people" element={ <People />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </>
  )
}

export default App
