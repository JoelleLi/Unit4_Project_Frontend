import { createContext, useContext, useState } from "react"
import axios from "axios"

const PersonContext = createContext()

export function usePersons() {
    return useContext(PersonContext)
}

export const PersonsProvider = ({children}) => {
    const [person, setPerson] = useState({})
    const [personId, setPersonId] = useState({})

    async function getPersonDetails(id) {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/persons/profile/${id}/`)
            const personDetails = response.data
            setPerson(personDetails)
            
        } catch (error) {
            console.error("Error fetching person details:", error)
            return null
        }
    }

    return (
        <PersonContext.Provider value={{
            person,
            setPerson,
            personId,
            setPersonId,
            getPersonDetails
        }}
        >
            {children}
        </PersonContext.Provider>
    )
}