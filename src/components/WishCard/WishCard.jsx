import { useEffect, useState } from "react";
import axios from "axios";
import './WishCard.css'

export default function WishCard({ wish }) {
  //   const token = localStorage.getItem("access_token")
  const [wishImages, setWishImages] = useState("");

  async function fetchData() {
    if (wish.images) {
      console.log(wish.images[0]);
      try {
        const imagesResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/photos/${wish.images[0]}`,
          {
            headers: {
              "Content-Type": "application/json",
              // "Authorization": `Bearer ${token}`
            },
          }
        );
        const imagesData = imagesResponse.data;
        console.log(imagesData);
        setWishImages(imagesData);
      } catch (error) {
        console.log(error);
      }
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card bg-base-100 shadow-xl mb-3 border">
      <div className="p-3 flex flex-row">
        {wishImages ? (
          <div className="avatar">
            <div className="w-24 h-24 rounded">
              <img src={wishImages.url} alt="" />
            </div>
          </div>
        ) : (
        <div className="avatar placeholder">
        <div className="bg-neutral text-neutral-content w-24 h-24 rounded h-16">
            <p>No Image</p>
            <p>👀</p>
        </div>
        </div>
        )}
        <div className="flex flex-col content-center justify-center flex-grow">
            <p className="text-center"><strong>{wish.name}</strong></p>
            <p>Priority: {wish.priority}</p>
            <div>{wish.reserved ? <p>Reserved ✅</p> : <p>Reserved ❌</p>}</div>
        </div>

      </div>
    </div>
  );
}
