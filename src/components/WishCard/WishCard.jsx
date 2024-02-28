import { useEffect, useState } from "react"
import axios from "axios";

export default function WishCard({ wish }) {
  const token = localStorage.getItem("access_token")
  const [wishImages, setWishImages] = useState("")

  async function fetchData() {
    if (wish.images) {
        console.log(wish.images[0])
        try {
            const imagesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/photos/${wish.images[0]}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const imagesData = imagesResponse.data
            console.log(imagesData)
            setWishImages(imagesData);
        } catch (error) {
            console.log(error);
        }
    } 
}

useEffect(() => {
    fetchData()   
}, [])

  return (
    <div className="flex">
        <img className="h-10 w-10 rounded-full border" src={wishImages.url} alt="" />
        <p>{wish.name}</p> &nbsp;|
        &nbsp;
        <p>Priority: {wish.priority}</p>
    </div>
  )
}
