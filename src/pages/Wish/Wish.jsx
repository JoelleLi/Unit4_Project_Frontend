import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"
import "./Wish.css"

export default function Wish({isLoggedIn}) {
  const token = localStorage.getItem("access_token")
  const [wish, setWish] = useState({})
  const [wishImages, setWishImages] = useState("")
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

        if (singleWish.data.images && singleWish.data.images.length > 0) {
          for (let i = 0; i < singleWish.data.images.length; i++){
            try {
              const imagesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/photos/${singleWish.data.images[i]}`, {
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                  }
              });
              const imagesData = imagesResponse.data
              console.log(imagesData)
              setWishImages((prevImages) => [...prevImages, imagesData]);
              console.log(wishImages)

            } catch (error) {
              console.log(error);
            }
          }
        } else {
          console.log("No images")
        }
    }
    catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    fetchData()
    
  }, [])


  return (
    <div>
      <p>{wish.name}</p>
      <div id="wishesGrid">
        {wishImages ? 
        wishImages.map(image => (
        <img src={image.url} alt="" width="100vmin"/>
        ))
        : 
        <div>This wish does not have an image uploaded</div>
        }
      </div>
      <p>Desc: {wish.description}</p>
      <p>Link: {wish.url}</p>
      <p>Priority: {wish.priority}</p>

      {isLoggedIn
      ?
        <Link to={`/wish/edit/${wish.id}/`} >
          <button>Edit Wish</button>
        </Link>
      :
      <></>
      }



    </div>

  )
}
