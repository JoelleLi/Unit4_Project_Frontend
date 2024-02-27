import { useState, useEffect } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

export default function Wish({isLoggedIn}) {
  const token = localStorage.getItem("access_token")
  const [wish, setWish] = useState({})
  const { id } = useParams()

  async function fetchData() {
      try {
          const singleWish = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // Include access token in the request headers
            }
          }
          )
          setWish(singleWish.data)
          console.log(singleWish.data)
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
      <p>{wish.name}</p>
      {wish.images && wish.images.map(image => (
        <img src={image} alt="" key={image.idx}/>
        ))
      }
      <p>{wish.description}</p>

    </div>

  )
}
