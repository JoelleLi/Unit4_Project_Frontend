import { useEffect, useState } from "react"
import axios from "axios";

export default function WishCard({ wish }) {
//   const token = localStorage.getItem("access_token")
  const [wishImages, setWishImages] = useState("")

  async function fetchData() {
    if (wish.images) {
        console.log(wish.images[0])
        try {
            const imagesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/photos/${wish.images[0]}`, {
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${token}`
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
// eslint-disable-next-line react-hooks/exhaustive-deps 
}, [])

  return (
    <div className="flex">

        <div className="avatar">
        <div className="w-24 rounded">
            <img src={wishImages.url} alt=""/>
        </div>
        </div>
        <div>
            <p>{wish.name}</p>
            <p>Priority: {wish.priority}</p>
            <div>
            {wish.reserved
            ?
            <p>Reserved ✅</p>
            :
            <p>Reserved ❌</p>
            }
            </div>
        </div>
    </div>
  )
}
