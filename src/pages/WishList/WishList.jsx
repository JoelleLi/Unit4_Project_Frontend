import { useState, useEffect } from "react"
import { useUsers } from "../../context/UserContext"
import { Link } from "react-router-dom"
import axios from "axios"

export default function WishList({isLoggedIn}) {
  const token = localStorage.getItem("access_token")
  const [wishList, setWishList] = useState([])
  const {username} = useUsers()

  async function fetchData() {
    try {
        const wishes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/wishlist/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include access token in the request headers
          }
        }
        )
        setWishList(wishes.data)
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
    <div>My WishList</div>

    <ul className="p-6 divide-y divide-slate-200">
      {wishList && wishList.map(wish => (
        <Link to={`/wishlist/wish/${wish.id}`} key={wish.id} >
        <li className="flex px-6 py-4 mb-1 rounded first:pt-0 last:pb-0 border border-gray-500 border-dashed">
          <img className="h-10 w-10 rounded-full border" src={wish.image} alt="" />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-slate-900">{wish.name}</p>
          </div>
        </li>
        </Link>
        ))
      }
    </ul>

    <Link to="/wishlist/add">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          Add Wish
      </button>
    </Link>
    </div>
  )
}
