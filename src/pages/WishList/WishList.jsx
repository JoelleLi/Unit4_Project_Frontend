import { useState, useEffect } from "react"
import { useUsers } from "../../context/UserContext"
import { Link, useParams } from "react-router-dom"
import WishCard from "../../components/WishCard/WishCard"
import axios from "axios"
import { usePersons } from "../../context/PersonContext"

export default function WishList() {
  const token = localStorage.getItem("access_token")
  const [wishList, setWishList] = useState([])
  const {username} = useUsers()
  const { person } = usePersons()
  const params = useParams()
  const { id } = params

  async function fetchData() {
    try {
      let wishes;
      if (params.id) {
        wishes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/wishlist/person/${params.id}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include access token in the request headers
          }
        });
      } else {
        wishes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/wishlist/${username}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include access token in the request headers
          }
        });
      }
      setWishList(wishes.data);
      console.log(wishes.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [params]); // Call fetchData whenever params change

  return (
    <div>
    <div>My WishList</div>
    {wishList.length > 0
    ?
    <div className="p-6 divide-y divide-slate-200">
      {wishList && wishList.map(wish => (
        <Link to={`/wishlist/wish/${wish.id}`} key={wish.id} >
        <WishCard wish={ wish } key={ wish.id } />
        </Link>
        ))
      }
    </div>
    :
    <p>No wishes yet</p>
    }

    

    <Link to="/wishlist/add">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          Add Wish
      </button>
    </Link>
    </div>
  )
}
