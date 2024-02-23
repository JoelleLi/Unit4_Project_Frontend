import './App.css'
import { Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Home from "./components/Home"
import UserProfile from './components/UserProfile'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={ <Home /> } />
        <Route path="/user" element={ <UserProfile />} />
      </Routes>
    </>
  )
}

export default App
