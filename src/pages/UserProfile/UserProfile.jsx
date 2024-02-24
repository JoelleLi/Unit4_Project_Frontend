import { useEffect, useState } from "react"
import { useUsers } from "../../context/UserContext"
import axios from "axios"


export default function UserProfile({isLoggedIn}) {
    // const [userFirstName, setUserFirstName] = useState([])
    const [userProfile, setUserProfile] = useState({})

    const { username, userFirstName } = useUsers()

    async function fetchData() {
        try {
            const userProfileData = await axios.get(`http://localhost:8000/userprofile/${username}`)
            setUserProfile(userProfileData.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

  return (
    <div>
      {isLoggedIn
      ?
      <>
      <p>My Profile</p>
      <p>Username: {username}</p>
      <p>Hi, {userFirstName}</p>
      <div>
        <p>My Birthday: {userProfile.birthday}</p>
        <p>Favourite Colours: {userProfile.colours}</p>
        <p>Favourite Cake: {userProfile.cake}</p>
        <p>Dietary Requirements: {userProfile.dietary}</p>
        <p>Drinks Alcohol: {userProfile.drinks_alcohol}</p>
        <p>Favourite Flowers: {userProfile.flowers}</p>
        <p>Likes Surprises: {userProfile.likes_surprises}</p>
      </div>
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
