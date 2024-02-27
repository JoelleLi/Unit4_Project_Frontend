import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"

export default function Person({isLoggedIn}) {
    const token = localStorage.getItem("access_token")
    const [personProfile, setPersonProfile] = useState({})
    const { id } = useParams()

    async function fetchData() {
        try {
            const person = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/persons/profile/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include access token in the request headers
              }
            }
            )
            setPersonProfile(person.data)
            console.log(person.data)
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

  return (
    <div>
        <div>Person</div>
        {personProfile.image ? <img src={personProfile.image} alt=""/> : <p>Image</p>}
        <p>{personProfile.first_name} {personProfile.last_name}</p>
        <p>Card: {personProfile.card} Present: {personProfile.present}</p>

        <Link to={`/editperson/${personProfile.id}`}>
        <button className="bg-pink-300 hover:bg-blue-700 text-grey font-bold py-2 px-4 rounded-full">
          Edit Person
        </button>
      </Link>

      <div>
      <Link to={`/editperson/${personProfile.id}`}>
        <button className="bg-pink-300 hover:bg-blue-700 text-grey font-bold py-2 px-4 rounded-full">
          {personProfile.first_name}
        </button>
      </Link>

      <Link to={`/editperson/${personProfile.id}`}>
        <button className="bg-pink-300 hover:bg-blue-700 text-grey font-bold py-2 px-4 rounded-full">
          WishList
        </button>
      </Link>
      </div>
    </div>

  )
}
