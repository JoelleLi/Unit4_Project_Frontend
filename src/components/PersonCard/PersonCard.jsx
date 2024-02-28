import { useEffect, useState } from "react"
import axios from "axios";

export default function PersonCard({ person }) {
    const token = localStorage.getItem("access_token")
    const [profileImage, setProfileImage] = useState("")

    async function fetchData() {
        if (person.image) {
            try {
                const photoResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/photos/${person.image}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                const photoData = photoResponse.data;
                setProfileImage(photoData.url);
            } catch (error) {
                console.log(error);
            }
        }
    }
    
    useEffect(() => {
        fetchData()   
    }, [])

  return (
    <div>
        <p>{person.first_name} {person.last_name}</p>
        <img className="h-10 w-10 rounded-full" src={profileImage} alt="" />
        <p></p>
    </div>
  )
}
