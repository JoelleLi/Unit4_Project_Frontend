import { useEffect, useState } from "react"
import axios from "axios"


export default function UserProfile() {
    const [data, setData] = useState([])
    const [data2, setData2] = useState([])


    async function fetchData() {
        try {
            const response = await axios.get("http://localhost:8000/userprofiles")
            setData(response.data)
            const response2 = await axios.get("http://localhost:8000/users")
            setData2(response2.data)

        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

  return (
    <>
        <div>UserProfile</div>
        <p>UserIndex</p>
        {data &&
        data.map(userprofile => (
          <div key={userprofile.id}>
            <p>{userprofile.user}</p>
            <p>{userprofile.cake}</p>
          </div>
        ))
      }
          {data2 &&
        data2.map(user => (
          <div key={user.id}>
            <p>{user.first_name}</p>
          </div>
        ))
      }
      
    </>
  )
}
