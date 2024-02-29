import { Link } from "react-router-dom"
import { useUsers } from "../../context/UserContext"
import "./NavBar.css";

export default function NavBar({ isLoggedIn }) {
  const { username } = useUsers()
  return (
    <div className="mb-4">
      <ul className="menu menu-horizontal bg-base-200 rounded-box">
        <li>
          <Link to="/">
            <img src="https://cdn-icons-png.flaticon.com/512/7133/7133312.png" alt="" width="21vmin"/>
          </Link>
        </li>

        <Link to={`/user/${username}`}>
          <li>
            <img src="https://images.rawpixel.com/image_png_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTY1LnBuZw.png" alt="" width="53vmin"/>
          </li>
        </Link>

        <Link to={`/wishlist/${username}`}>
          <li>
            <img src="https://cdn-icons-png.freepik.com/256/1950/1950715.png" alt="" width="52vmin"/>
          </li>
        </Link>

        <Link to="/people">
          <li>
            <img src="https://cdn2.iconfinder.com/data/icons/lifestyle-set-01/64/birthday-512.png" alt="" width="53vmin"/>
            {/* <div className="">Birthdays</div> */}
          </li>
        </Link>

        {/* {isLoggedIn ? 
      <Link to="/logout">
      <li>
      <div className=''>Log Out</div>
      </li>
      </Link> 
      : 
      <Link to="/">
      <div className=''>Log In</div>
      </Link> 
      } */}
      </ul>
    </div>
  );
}
