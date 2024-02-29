import { useEffect, useState } from "react"
import { useUsers } from "../../context/UserContext"
import axios from "axios"
import { Link } from 'react-router-dom'

export default function UserProfile({isLoggedIn}) {
  const [profileImage, setProfileImage] = useState("")
    const { username, userFirstName, userProfile, setUserProfile } = useUsers()
    const token = localStorage.getItem("access_token")

    async function fetchData() {
        try {
            const userProfileResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/userprofile/${username}`, 
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include access token in the request headers
              }
            } 
            )
            const userProfileData = userProfileResponse.data
            setUserProfile(userProfileData)

            if (userProfileData.image) {
              const photoResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/photos/${userProfileData.image}`, {
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              })
              const photoData = photoResponse.data
              setProfileImage(photoData.url)
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
      if (isLoggedIn) {
        fetchData()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const formatBirthday = () => {
      if (!userProfile.birthday) return ""
      const date = new Date(userProfile.birthday)
      const day = date.getDate()
      const month = date.toLocaleString("default", { month: "long" })
      let suffix = "th";
      if (day === 1 || day === 21 || day === 31) suffix = "st"
      else if (day === 2 || day === 22) suffix = "nd"
      else if (day === 3 || day === 23) suffix = "rd"
      return `${day}${suffix} ${month}`
    }

    const formatBirthdayMessage = () => {
      if (!userProfile.birthday) return ""
    
      const birthDate = new Date(userProfile.birthday)
      const today = new Date()
    
      let ageDiff = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        ageDiff--
      }
    
      const nextBirthdayYear = today.getFullYear()
      const nextBirthday = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate())
      const formattedNextBirthday = `${nextBirthday.getDate()} ${nextBirthday.toLocaleString("default", { month: "long" })}`
    
      return `You will be ${ageDiff + 1} years old on ${formattedNextBirthday}.`
    }

  return (
    <div className="container mx-auto">
      {isLoggedIn
      ?
      <>
      <p>My Profile</p>
      <p>Username: {username}</p>
      <p>Hi, {userFirstName}</p>
      <p>{formatBirthdayMessage()}</p>
      {userProfile.image
      ?
      <>
      <div className="avatar">
        <div className="w-24 rounded-full">
          <img src={profileImage} alt="User Profile Avatar"/>
        </div>
      </div>
      </>
      :
      <p>No image uploaded</p>
      }
      <div>
        <p>My Birthday: {formatBirthday()}</p>
        <p>Favourite Colours: {userProfile.colours}</p>
        <p>Favourite Cake: {userProfile.cake}</p>
        <p>Dietary Requirements: {userProfile.dietary}</p>
        <p>Favourite Flowers: {userProfile.flowers}</p>
        <p>Likes Surprises: {userProfile.likes_surprises}</p>
        <p>Drinks Alcohol: {userProfile.drinks_alcohol}</p>
      </div>

      <Link to="/editprofile">
        <button className="bg-pink-300 hover:bg-blue-700 text-grey font-bold py-2 px-4 rounded-full">
          Edit Profile
        </button>
      </Link>

      <nav>
      <Link to="/user">My Profile</Link>
      |
      <Link to={`/wishlist/${username}`}>My Wishlist</Link>
      |
      <Link to="/">Things I Like</Link>
      |
      <Link to="/">My Notes</Link>
      
      {isLoggedIn ? 
      <Link to="/logout">
      <li>
      <div className=''>Log Out</div>
      </li>
      </Link> 
      : 
      <Link to="/">
      <div className=''>Log In</div>
      </Link> 
      }
    </nav>
      </>
      :
      <p>You're not logged in</p>
      }      
    </div>
  )
}
