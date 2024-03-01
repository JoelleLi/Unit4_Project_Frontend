import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function Wish({ isLoggedIn, personId }) {
  // const token = localStorage.getItem("access_token");
  const [wish, setWish] = useState({});
  const [wishImages, setWishImages] = useState("");
  const [reservedChecked, setReservedChecked] = useState(wish.reserved);
  const { id, username } = useParams();
  const navigate = useNavigate()
  
  
  async function fetchData() {
    try {
      const singleWish = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Include access token in the request headers
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
                  // Authorization: `Bearer ${token}`,
                },
              }
            );
            return response.data;
          })
        );
        setWishImages(imagesData);
      } else {
        // console.log("No images");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData()
    // if (wish.reserved !== undefined) {
    //   setReservedChecked(wish.reserved)
    // }
    // setReservedChecked(wish.reserved || false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateReserved(check) {
    setReservedChecked((prevState) => !prevState);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}/`,
        {
          reserved: check,
          name: wish.name,
          priority: wish.priority,
          // Add other fields if needed
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Include access token in the request headers
          },
          // withCredentials: true,
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
      <h5>{wish.name}</h5>
      <div id="wishesGrid">
        {wishImages ? (
          <div className="carousel w-full mt-4 mb-4">
            {wishImages.map((image, idx) => (
              <div
                id={`slide${idx + 1}`}
                className="carousel-item relative w-full"
                key={idx}
              >
                <img src={image.url} className="w-full" alt="" />
                <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                  <a
                    href={`#slide${idx}`}
                    className="btn btn-circle w-4 bg-secondary"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${idx + 2}`}
                    className="btn btn-circle w-4 bg-secondary"
                  >
                    ❯
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="avatar placeholder m-4">
            <div className="bg-neutral text-neutral-content w-24 h-24 rounded h-16">
              <p>No Image</p>
              <p>👀</p>
            </div>
          </div>
        )}

        {isLoggedIn ? (
          <></>
        ) : (
          <>
            <p>Let {username} know you've reserved this wish.</p>
          </>
        )}
      </div>

      {wish && wish.reserved !== undefined && (
  <div className="flex flex-row content-center justify-center mt-1">
    <div className="badge badge-accent">Reserved</div>
    <label className="swap swap-flip ml-1">
      <input
        type="checkbox"
        checked={reservedChecked}
        onChange={(e) => updateReserved(e.target.checked)}
      />
      <div className="swap-off">✅</div>
      <div className="swap-on">❌</div>
    </label>
  </div>
)}
      <div className="flex flex-col gap-3 mt-5 mb-5">
        <div className="badge badge-outline">Description</div>

        <p className="text-left">{wish.description}</p>

        <div className="badge badge-outline text-left">Link</div>

        <p>{wish.url}</p>

        {wish.priority === "High" ? (
          <div className="badge badge-error gap-2">Priority: High</div>
        ) : (
          <></>
        )}
        {wish.priority === "Medium" ? (
          <div className="badge badge-warning gap-2">Priority: Medium</div>
        ) : (
          <></>
        )}
        {wish.priority === "Low" ? (
          <div className="badge badge-success gap-2">Priority: Low</div>
        ) : (
          <></>
        )}
      </div>
      {isLoggedIn ? (
        <>
          <div className="">
            <Link to={`/wish/edit/${username}/${wish.id}/`}>
              <button className="btn btn-active btn-neutral m-2">
                Edit Wish
              </button>
            </Link>
            {/* <Link to={`/wishlist/${username}/`}> */}
              <button onClick={() => navigate(-1)} className="btn btn-outline m-2">Back</button>
            {/* </Link> */}
          </div>
        </>
      ) : (
        <div>

          <button onClick={() => navigate(-1)} className="btn btn-outline m-2">Back</button>
        

        </div>
      )}
    </div>
  );
}
