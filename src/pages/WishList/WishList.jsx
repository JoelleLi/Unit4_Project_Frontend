import { useState, useEffect } from "react";
// import { useUsers } from "../../context/UserContext"
import { Link, useParams } from "react-router-dom";
import WishCard from "../../components/WishCard/WishCard";
import axios from "axios";
// import { usePersons } from "../../context/PersonContext"

export default function WishList({ isLoggedIn }) {
  // const token = localStorage.getItem("access_token")
  const [wishList, setWishList] = useState([]);
  // const {username} = useUsers()
  // const { person } = usePersons()
  const { username } = useParams();

  async function fetchData() {
    try {
      const wishes = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${token}` // Include access token in the request headers
          },
        }
      );

      setWishList(wishes.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]); // Call fetchData whenever params change

  return (
<div>
  {username !== "null"? (
    <>
      <h3>{username}'s WishList</h3>
      {wishList.length > 0 ? (
        <div className="p-6 divide-y divide-slate-200">
          {wishList.map((wish) => (
            <Link to={`/wishlist/wish/${username}/${wish.id}`} key={wish.id}>
              <WishCard wish={wish} key={wish.id} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="m-5">
          <p>No wishes yet</p>
        </div>
      )}
    </>
  ) : (
    <div>
      <p>You're not logged in</p>
      <p>Log in to view your wishlist</p>
      <Link to="/">
      <button className="btn btn-neutral m-3">Log In</button>
      </Link>
    </div>
  )}

  {isLoggedIn && (
    <Link to="/wishlist/add">
      <button className="btn btn-outline">Add Wish</button>
    </Link>
  )}
</div>
  );
}
