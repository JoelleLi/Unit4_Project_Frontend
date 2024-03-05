import { useContext, createContext, useState, useEffect } from "react"
import axios from "axios"

const UserContext = createContext()

export function useUsers() {
    return useContext(UserContext)
}

export const UsersProvider = ({children}) => {
    const [username, setUsername] = useState(null)
    const [userFirstName, setUserFirstName] = useState([])
    const [userProfile, setUserProfile] = useState({})
    const [userDetails, setUserDetails] = useState({})

    useEffect(() => {
        // Initialize username from local storage
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) {
            setUsername(storedUsername)
            getUser(username)
        }
    }, [username])

    async function getUser(username) {
        try {
            const userResponse = await axios.get(`http://localhost:8000/users/${username}`,
            {
              headers: {
                "Content-Type": "application/json",
                // "Authorization": `Bearer ${token}` // Include access token in the request headers
              }
            }
            )
            setUserDetails(userResponse.data)
            console.log(userResponse.data)
            
        }
        catch (error) {
            console.log(error)
        }
    }


    return (
        <UserContext.Provider value={{
            username,
            setUsername,
            userFirstName,
            setUserFirstName,
            userProfile,
            setUserProfile,
            userDetails,
            setUserDetails,
            getUser
        }}
        >
            {children}
        </UserContext.Provider>
    )
}