import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePersons } from "../../context/PersonContext";
import axios from "axios";

export default function Person({ isLoggedIn, userDetails }) {
  const token = localStorage.getItem("access_token");
  const [personProfile, setPersonProfile] = useState({});
  const [profileImage, setProfileImage] = useState();
  const [cardChecked, setCardChecked] = useState();
  const [presentChecked, setPresentChecked] = useState(false);
  const { setPerson } = usePersons();

  const { id } = useParams();

  async function fetchData() {
    try {
      const person = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/persons/profile/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const personData = person.data;
      setPersonProfile(personData);
      setPerson(personData);
      setCardChecked(personData.card);
      setPresentChecked(personData.present);

      if (personData.image) {
        try {
          const image = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/photos/${personData.image}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const imageData = image.data;
          setProfileImage(imageData.url);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("No photo");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateProfile() {
    try {
      const updatedProfile = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/persons/profile/${personProfile.id}/`,
        {
          card: cardChecked,
          present: presentChecked,
          created_by: userDetails.id,
          first_name: personProfile.first_name,
          last_name: personProfile.last_name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Profile updated successfully", updatedProfile.data);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  }

  const formatBirthday = () => {
    if (!personProfile.birthday) return "";
    const date = new Date(personProfile.birthday);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) suffix = "st";
    else if (day === 2 || day === 22) suffix = "nd";
    else if (day === 3 || day === 23) suffix = "rd";
    return `${day}${suffix} ${month}`;
  };

  useEffect(() => {
    fetchData();
    if (
      cardChecked !== personProfile.card ||
      presentChecked !== personProfile.present
    ) {
      updateProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardChecked, presentChecked]);

  // useEffect(() => {
  //   if (cardChecked !== personProfile.card) {
  //     updateProfile();
  //   }
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [cardChecked, personProfile.card])

  return (
    <>
      <div className="card card-compact bg-base-200 shadow-xl">
        {personProfile.image ? (
          <span className="">
            <div className="avatar">
              <div className="w-24 rounded-full mt-6">
                <img src={profileImage} alt="User Profile Avatar" />
              </div>
            </div>
          </span>
        ) : (
          <span className="">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-24 h-24 mt-6">
                <span className="text-3xl">
                  {personProfile.first_name
                    ? personProfile.first_name.charAt(0).toUpperCase()
                    : ""}
                </span>
              </div>
            </div>
          </span>
        )}

        <div className="card-body">
          <h3>{personProfile.first_name}'s Profile</h3>

          <div className="mb-3">
            <label className="swap swap-flip mr-1">
              {/* Hidden checkbox to control the state */}
              <input
                type="checkbox"
                checked={cardChecked}
                onChange={() => setCardChecked((prevState) => !prevState)}
              />
              Card?
              {/* Emoji for when checkbox is checked */}
              <div className="swap-on">✅</div>
              {/* Emoji for when checkbox is unchecked */}
              <div className="swap-off">❌</div>
            </label>

            <label className="swap swap-flip ml-1">
              {/* Hidden checkbox to control the state */}
              <input
                type="checkbox"
                checked={presentChecked}
                onChange={() => setPresentChecked((prevState) => !prevState)}
              />
              Present?
              {/* Emoji for when checkbox is checked */}
              <div className="swap-on">✅</div>
              {/* Emoji for when checkbox is unchecked */}
              <div className="swap-off">❌</div>
            </label>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">My Birthday</div>
            <div className="badge">{formatBirthday()}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Favourite Colours</div>
            <div className="badge">{personProfile.colours}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Favourite Cake</div>
            <div className="badge">{personProfile.cake}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Dietary Req.</div>
            <div className="badge">{personProfile.dietary}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Favourite Flowers</div>
            <div className="badge">{personProfile.flowers}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Favourite Brands</div>
            <div className="badge">{personProfile.brands}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Likes Surprises?</div>
            <div className="badge">{personProfile.likes_surprises}</div>
          </div>

          <div className="flex flex-row">
            <div className="badge badge-outline">Drinks Alcohol?</div>
            <div className="badge">{personProfile.drinks_alcohol}</div>
          </div>

          <div className="card-actions justify-center mt-3 mb-1">
            <Link to={`/editperson/${personProfile.id}`}>
              <button className="btn btn-outline">Edit Profile</button>
            </Link>
            <Link to={`/wishlist/person/${personProfile.id}`}>
              <button className="btn btn-active btn-neutral">
                {personProfile.first_name}'s WishList
              </button>
            </Link>
          </div>
        </div>
      </div>
      {isLoggedIn ? (
        <div className="m-4">
          <Link to="/people">
            <button className="btn btn-outline m-2">Back</button>
          </Link>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
