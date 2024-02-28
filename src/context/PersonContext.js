import { createContext, useContext, useState } from "react";

const PersonContext = createContext()

export function usePersons() {
    return useContext(PersonContext)
}

export const PersonsProvider = ({children}) => {
    const [person, setPerson] = useState({})

    return (
        <PersonContext.Provider value={{
            person,
            setPerson
        }}
        >
            {children}
        </PersonContext.Provider>
    )
}