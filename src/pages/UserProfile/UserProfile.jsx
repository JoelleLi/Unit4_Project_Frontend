import { useEffect, useState } from "react";
import { useUsers } from "../../context/UserContext";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function UserProfile({ isLoggedIn }) {
  const [profileImage, setProfileImage] = useState("");
  const {
    userFirstName,
    userProfile,
    setUserProfile,
    userDetails,
    getUser,
    setUsername,
  } = useUsers();
  // const token = localStorage.getItem("access_token");

  const { username } = useParams();

  async function fetchData() {
    try {
      const userProfileResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/userprofile/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Include access token in the request headers
          },
        }
      );
      const userProfileData = userProfileResponse.data;
      setUserProfile(userProfileData);

      if (userProfileData.image) {
        const photoResponse = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/photos/${userProfileData.image}`,
          {
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${token}`,
            },
          }
        );
        const photoData = photoResponse.data;
        setProfileImage(photoData.url);
      }
    } catch (error) {
      console.log(error);
    }
  }
  console.log();

  useEffect(() => {
    setUsername(username);
    getUser();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatBirthday = () => {
    if (!userProfile.birthday) return "";
    const date = new Date(userProfile.birthday);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
    return `${day}${suffix} ${month}`;
  };

  // const formatBirthdayMessage = () => {
  //   if (!userProfile.birthday) return "";

  //   const birthDate = new Date(userProfile.birthday);
  //   const today = new Date();

  //   let ageDiff = today.getFullYear() - birthDate.getFullYear();
  //   const monthDiff = today.getMonth() - birthDate.getMonth();
  //   if (
  //     monthDiff < 0 ||
  //     (monthDiff === 0 && today.getDate() < birthDate.getDate())
  //   ) {
  //     ageDiff--;
  //   }

  //   const nextBirthdayYear = today.getFullYear();
  //   const nextBirthday = new Date(
  //     nextBirthdayYear,
  //     birthDate.getMonth(),
  //     birthDate.getDate()
  //   );
  //   const formattedNextBirthday = `${nextBirthday.getDate()} ${nextBirthday.toLocaleString(
  //     "default",
  //     { month: "long" }
  //   )}`;

  //   return `You will be ${ageDiff + 1} years old on ${formattedNextBirthday}.`;
  // };

  return (
    <>
      <div className="card card-compact bg-base-200 shadow-xl">
        {userProfile.image ? (
          <span className="">
            <div className="avatar">
              <div className="w-24 rounded-full m-3">
                <img src={profileImage} alt="User Profile Avatar" />
              </div>
            </div>
          </span>
        ) : (
          <p>No image uploaded</p>
        )}

        <div className="card-body">
          {isLoggedIn ? <h3 className="card-title">Hi, {userDetails.first_name}</h3>
          : <h3>{username}'s Profile</h3>}

          <div className="flex flex-row">
            <div className="badge badge-outline">My Birthday</div>
            <div className="badge">{formatBirthday()}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Favourite Colours</div>
            <div className="badge">{userProfile.colours}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Favourite Cake</div>
            <div className="badge">{userProfile.cake}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Dietary Req.</div>
            <div className="badge">{userProfile.dietary}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Favourite Flowers</div>
            <div className="badge">{userProfile.flowers}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Favourite Brands</div>
            <div className="badge">{userProfile.brands}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Likes Surprises?</div>
            <div className="badge">{userProfile.likes_surprises}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Drinks Alcohol?</div>
            <div className="badge">{userProfile.drinks_alcohol}</div>
          </div>

          <div className="card-actions justify-end">
            {isLoggedIn ? (
              <Link to="/editprofile">
                <button className="btn btn-primary">Edit Profile</button>
              </Link>
            ) : (
              <Link to={`/wishlist/${username}`}>
                <button className="btn btn-primary">
                  View Wishlist
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* <p>{formatBirthdayMessage()}</p> */}

      <Link to="/logout">
        <button className="btn btn-outline m-4">Log Out</button>
      </Link>
    </>
  );
}
