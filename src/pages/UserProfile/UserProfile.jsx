import { useEffect } from "react"
import { useUsers } from "../../context/UserContext"
import axios from "axios"
import { Link } from 'react-router-dom'

export default function UserProfile({isLoggedIn}) {
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
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
      if (isLoggedIn) {
        fetchData()
      }
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
      <img src={userProfile.image} alt="User Profile Avatar" />
      :
      <p>No image uploaded</p>
      }
      <div>
        <p>My Birthday: {formatBirthday()}</p>
        <p>Favourite Colours: {userProfile.colours}</p>
        <p>Favourite Cake: {userProfile.cake}</p>
        <p>Dietary Requirements: {userProfile.dietary}</p>
        <p>Drinks Alcohol: {userProfile.drinks_alcohol}</p>
        <p>Favourite Flowers: {userProfile.flowers}</p>
        <p>Likes Surprises: {userProfile.likes_surprises}</p>
      </div>

      {/* <div>
        <form onSubmit={handleSubmit}>
          <input type="file" name="photo-file" onChange={handleFileChange} />
          <br />
          <button type="submit">Upload Photo</button>
        </form>
      </div> */}

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

    </nav>

      {/* {data &&
        data.map(userprofile => (
          <div key={userprofile.id}>
            <p>{userprofile.user}</p>
            <p>{userprofile.cake}</p>
          </div>
          ))
        }
        {userFirstName &&
        userFirstName.map(user => (
          <div key={user.id}>
            <p>{user.first_name}</p>
          </div>
          ))
        } */}
      </>
      :
      <p>You're not logged in</p>
      }      
    </div>
  )
}
