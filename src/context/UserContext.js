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

    useEffect(() => {
        // Initialize username from local storage
        const storedUsername = localStorage.getItem('username')
        if (storedUsername) {
            setUsername(storedUsername)
            console.log("Username stored")
        }
    }, [])

    return (
        <UserContext.Provider value={{
            username,
            setUsername,
            userFirstName,
            setUserFirstName,
            userProfile,
            setUserProfile
        }}
        >
            {children}
        </UserContext.Provider>
    )
}