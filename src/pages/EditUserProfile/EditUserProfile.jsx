import { Link, useNavigate } from "react-router-dom"
import { useUsers } from "../../context/UserContext"
import { useState, useEffect } from "react"
import axios from "axios";

export default function EditUserProfile({isLoggedIn, userDetails}) {
    const token = localStorage.getItem("access_token")
    const [selectedFile, setSelectedFile] = useState(null)
    const [setFormSubmitted] = useState(false)
    const [profileId, setProfileId] = useState()
    const [profileImage, setProfileImage] = useState("")
    const [profileImageId, setProfileImageId] = useState()

    const { username, userProfile, setUserProfile } = useUsers()

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
      birthday: userProfile.birthday,
      colours: userProfile.colours,
      cake: userProfile.cake,
      dietary: userProfile.dietary,
      flowers: userProfile.flowers,
      brands: userProfile.brands,
      likes_surprises: userProfile.likes_surprises,
      drinks_alcohol: userProfile.drinks_alcohol,
    })

    function handleChange(e) {
      const { name, value } = e.target
      setFormData(prevFormData => ({ ...prevFormData, [name]: value }))
      console.log(formData)
    }

    async function saveEdit(formData, e) {
      e.preventDefault()
      const body = {
        birthday: formData.birthday,
        colours: formData.colours,
        cake: formData.cake,
        dietary: formData.dietary,
        flowers: formData.flowers,
        brands: formData.brands,
        likes_surprises: formData.likes_surprises,
        drinks_alcohol: formData.drinks_alcohol,
        user: userDetails.id
      }
      console.log(body)
  
      try {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/userprofile/${username}/`, body, 
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include access token in the request headers
          }, 
          withCredentials: true
        })
        if (response.status === 200) {
        setUserProfile(prevUserDetails => ({
          ...prevUserDetails,
          ...body
        }))
        setFormData(body)
        setFormSubmitted(true) 
        console.log("Form submitted successfully", body)
      }
      } catch (error) {
        console.error(error)
      }
      navigate(`/user`)
  
    }

    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0])
    }
  
    const handleSubmit = async (event) => {
      event.preventDefault()
      
      // Create a FormData object to append the selected file
      const formData = new FormData()
      formData.append(
        'photo-file', selectedFile
        )

      try {
        // Send a POST request to upload the photo
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/userprofile/${profileId}/add_photo/`, formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            "Authorization": `Bearer ${token}` // Include access token in the request headers
          }
        })
        
        // Optionally, perform additional actions after successful upload
        console.log('Photo uploaded successfully!')
        console.log(profileImageId)

        if (profileImageId) {
          await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/photos/${profileImageId}/delete/`, formData, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              "Authorization": `Bearer ${token}` // Include access token in the request headers
            }
          })
  
          console.log("Old image deleted successfully, old id: ")
        }
      } catch (error) {
        console.error('Error uploading photo:', error)
      }
      fetchData()

    }

    async function fetchData() {
      try {
          const userProfileResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/userprofile/${username}`, 
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // Include access token in the request headers
            }
          } 
          )
          const userProfileData = userProfileResponse.data
          console.log(userProfileResponse.data)

          setUserProfile(userProfileData)
          setProfileId(userProfileData.id)
          setFormData({
            birthday: userProfile.birthday,
            colours: userProfile.colours,
            cake: userProfile.cake,
            dietary: userProfile.dietary,
            flowers: userProfile.flowers,
            brands: userProfile.brands,
            likes_surprises: userProfile.likes_surprises,
            drinks_alcohol: userProfile.drinks_alcohol
          })

          if (userProfileData.image) {
            const photoResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/photos/${userProfileData.image}`, {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              }
            })
            const photoData = photoResponse.data
            setProfileImageId(userProfileData.image)
            setProfileImage(photoData.url)
          } else {
            setProfileImage(null)
          }
      }
      catch (error) {
          console.log(error)
      }
  }

  const handleDeleteImage = async (profileImageId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/photos/${profileImageId}/delete/`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update profileImageId state to null after successful deletion
      // setProfileImageId(null);
    } catch (error) {
      console.log(error);
    }
    fetchData()
  };

    useEffect(() => {
      if (isLoggedIn) {
        fetchData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

  return (
    <>

      <div>
        {profileImage ? 
        <div>
        <img src={profileImage} alt="" width="100vmin" />
        <form onSubmit={handleSubmit}>
        <input type="file" name="photo-file" onChange={handleFileChange} />
        <br /><br/>
        <button type="submit">Change Photo</button>
        </form>
        <button onClick={() => handleDeleteImage(profileImageId)}>
          Delete Image
        </button>
        </div>
        :
        <form onSubmit={handleSubmit}>
        <input type="file" name="photo-file" onChange={handleFileChange} />
        <br /><br/>
        <button type="submit">Upload Photo</button>
        </form>
        }

      </div>


      <form onSubmit={(e) => saveEdit(formData, e)}>
        <div className="">
          <div className="border-b border-gray-900/10 pb-3">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Edit My Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly.
            </p>

            {/* <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  My Photo
                </label>
                <div className="mt-2 flex items-center gap-x-3">
                  <svg
                    className="h-12 w-12 text-gray-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <button
                    type="button"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div> */}
          </div>

          <div className="border-b border-gray-900/10 pb-3">
            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              {/* <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Last name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="last-name"
                    id="last-name"
                    autoComplete="family-name"
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div> */}

              <div className="col-span-full">
                <label
                  htmlFor="birthday"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  My Birthday
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    placeholder={userProfile.birthday}
                    id="date"
                    autoComplete="birthday"
                    max={formattedDate}
                    onChange={(e) => handleChange(e)} 
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="colours"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Favourite Colours
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="colours"
                    value={formData.colours}
                    placeholder={userProfile.colours}
                    id="colours"
                    autoComplete="colours"
                    onChange={(e) => handleChange(e)} 
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="cake"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Favourite Cake
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="cake"
                    value={formData.cake}
                    placeholder={userProfile.cake}
                    id="cake"
                    autoComplete="cake"
                    onChange={(e) => handleChange(e)} 
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="dietary"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Dietary Preferences
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="dietary"
                    value={formData.dietary}
                    placeholder={userProfile.dietary}
                    id="dietary"
                    autoComplete="dietary"
                    onChange={(e) => handleChange(e)} 
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="flowers"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Favourite Flowers
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="flowers"
                    value={formData.flowers}
                    placeholder={userProfile.flowers}
                    id="flowers"
                    autoComplete="flowers"
                    onChange={(e) => handleChange(e)} 
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="brands"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Favourite Brands
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="brands"
                    value={formData.brands}
                    placeholder={userProfile.brands}
                    id="brands"
                    autoComplete="brands"
                    onChange={(e) => handleChange(e)} 
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="likes_surprises"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Likes Surprises?
                </label>
                <div className="mt-2">
                  <select
                    id="likes_surprises"
                    name="likes_surprises"
                    value={formData.likes_surprises}
                    placeholder={userProfile.likes_surprises}
                    autoComplete="likes_surprises"
                    onChange={(e) => handleChange(e)} 
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>...</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Sometimes</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="drinks_alcohol"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Drinks Alcohol?
                </label>
                <div className="mt-2">
                  <select
                    id="drinks_alcohol"
                    name="drinks_alcohol"
                    value={formData.drinks_alcohol}
                    placeholder={userProfile.drinks_alcohol}
                    autoComplete="drinks_alcohol"
                    onChange={(e) => handleChange(e)} 
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>...</option>
                    <option>Yes</option>
                    <option>No</option>
                    <option>Sometimes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt- flex items-center justify-end gap-x-6">
          <Link to="/user">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className=""
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
