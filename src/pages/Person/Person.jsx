import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { usePersons } from "../../context/PersonContext"
import axios from "axios"

export default function Person({isLoggedIn}) {
  const token = localStorage.getItem("access_token")
  const [personProfile, setPersonProfile] = useState({})
  const [profileImage, setProfileImage] = useState()
  const { setPerson } = usePersons()

  const { id } = useParams()

  async function fetchData() {
    try {
        const person = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/persons/profile/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const personData = person.data;
        setPersonProfile(personData)
        setPerson(personData)
        console.log(personData)

        if (personData.image) {
            try {
                const image = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/photos/${personData.image}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const imageData = image.data;
                console.log(imageData);
                setProfileImage(imageData.url);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("No photo");
        }
    } catch (error) {
        console.log(error);
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
        {personProfile.image ? 
        <img src={profileImage} alt="" width="100vmin"/> : <p>Image Not Uploaded</p>}
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
          Edit {personProfile.first_name}'s Profile
        </button>
      </Link>

      <Link to={`/wishlist/person/${personProfile.id}`}>
        <button className="bg-pink-300 hover:bg-blue-700 text-grey font-bold py-2 px-4 rounded-full">
          WishList
        </button>
      </Link>
      </div>
    </div>

  )
}
