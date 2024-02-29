import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function Wish({ isLoggedIn }) {
  const token = localStorage.getItem("access_token");
  const [wish, setWish] = useState({});
  const [wishImages, setWishImages] = useState("");
  const [reservedChecked, setReservedChecked] = useState(false);
  const { id } = useParams();

  async function fetchData() {
    try {
      const singleWish = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include access token in the request headers
          },
        }
      );
      setWish(singleWish.data);

      if (singleWish.data.images && singleWish.data.images.length > 0) {
        const imagesData = await Promise.all(
          singleWish.data.images.map(async (imageId) => {
            const response = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/photos/${imageId}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return response.data;
          })
        );
        setWishImages(imagesData);
      } else {
        console.log("No images");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    setReservedChecked(wish.reserved || false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    updateReserved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reservedChecked]);

  async function updateReserved() {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}/`,
        {
          reserved: reservedChecked,
          name: wish.name,
          priority: wish.priority,
          // Add other fields if needed
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include access token in the request headers
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Wish reserved status updated successfully");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <p>{wish.name}</p>
      <div id="wishesGrid">
        {wishImages ? (
          <div className="carousel w-full">
            {wishImages.map((image, idx) => (
              <div
                id={`slide${idx + 1}`}
                className="carousel-item relative w-full"
                key={idx}
              >
                <img src={image.url} className="w-full" alt="" />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a href={`#slide${idx}`} className="btn btn-circle">
                    ❮
                  </a>
                  <a href={`#slide${idx + 2}`} className="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>This wish does not have an image uploaded</div>
        )}
      </div>

      <label className="swap swap-flip ml-1">
        {/* Hidden checkbox to control the state */}
        <input
          type="checkbox"
          checked={reservedChecked}
          onChange={() => setReservedChecked((prevState) => !prevState)}
        />
        Reserve
        {/* Emoji for when checkbox is checked */}
        <div className="swap-on">✅</div>
        {/* Emoji for when checkbox is unchecked */}
        <div className="swap-off">❌</div>
      </label>

      <p>Desc: {wish.description}</p>
      <p>Link: {wish.url}</p>
      <p>Priority: {wish.priority}</p>

      {isLoggedIn ? (
        <Link to={`/wish/edit/${wish.id}/`}>
          <button>Edit Wish</button>
        </Link>
      ) : (
        <></>
      )}
    </div>
  );
}