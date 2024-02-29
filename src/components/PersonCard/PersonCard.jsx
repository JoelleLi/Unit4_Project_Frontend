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

    const formatBirthdayMessage = () => {
        if (!person.birthday) return ""
      
        const birthDate = new Date(person.birthday)
        const today = new Date()
      
        let ageDiff = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          ageDiff--
        }
      
        const nextBirthdayYear = today.getFullYear()
        const nextBirthday = new Date(nextBirthdayYear, birthDate.getMonth(), birthDate.getDate())
        const formattedNextBirthday = `${nextBirthday.getDate()} ${nextBirthday.toLocaleString("default", { month: "long" })}`
      
        return `${person.first_name} will be ${ageDiff + 1} years old on ${formattedNextBirthday}`
      }
    
    useEffect(() => {
        fetchData()   
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <div>

        {person.image ? 
        <>
        <div className="avatar">
          <div className="w-16 rounded-full">
            <img src={profileImage} alt="User Profile Avatar"/>
          </div>
        </div>
        </> 
        : 
        <>
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-16">
            <span className="text-3xl">{person.first_name ? person.first_name.charAt(0).toUpperCase() : ''}</span>
          </div>
        </div> 
        </>
        }
        <p>{person.first_name} {person.last_name}</p>
        <p>{formatBirthdayMessage()}</p>

    </div>
  )
}
