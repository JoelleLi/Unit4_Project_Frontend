import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"

export default function AddBirthday({ userDetails }) {
  const token = localStorage.getItem("access_token")
  const [selectedFile, setSelectedFile] = useState(null)
  // const [formSubmitted, setFormSubmitted] = useState(false)

  const navigate = useNavigate()

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0])
  }

  const [formData, setFormData] = useState({
    // first_name: "",
    // last_name: "", 
    // birthday: "",
    // address: "",
    // colours: "",
    // cake: "",
    // dietary: "",
    // flowers: "",
    // brands: "",
    // likes_surprises: "",
    // drinks_alcohol: "",
    // username: userDetails.username
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prevFormData => ({ ...prevFormData, [name]: value }))
    // console.log(formData)
  }

  async function addPerson(formData, e) {
    e.preventDefault();
    const body = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        birthday: formData.birthday,
        address: formData.address,
        colours: formData.colours,
        cake: formData.cake,
        dietary: formData.dietary,
        flowers: formData.flowers,
        brands: formData.brands,
        likes_surprises: formData.likes_surprises,
        drinks_alcohol: formData.drinks_alcohol,
        created_by: userDetails.id
    };

    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/persons/add/${userDetails.id}/`, body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include access token in the request headers
            },
            withCredentials: true
        });

        if (response) {
            // console.log("Form submitted successfully");

            // Extract the ID of the newly created person from the response data
            const newPersonId = response.data.id;

            const photoFormData = new FormData();
            photoFormData.append('photo-file', selectedFile);

            try {
                // Send a POST request to upload the photo
                await axios.post(`${process.env.REACT_APP_BACKEND_URL}/persons/${newPersonId}/add_photo/`, photoFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${token}` // Include access token in the request headers
                    }
                });

                // Optionally, perform additional actions after successful upload
                console.log('Photo uploaded successfully!');

            } catch (error) {
                console.error('Error uploading photo:', error);
            }
        }
    } catch (error) {
        console.error(error);
        console.log(body);
    }
    navigate(`/people`);
}

  
    const today = new Date();
    // Format today's date to YYYY-MM-DD
    const formattedDate = today.toISOString().split('T')[0];
    // Set the minimum date attribute of the input field

  return (
    <div>
    <form onSubmit={(e) => addPerson(formData, e)} >
        <div className="">
          <div className="border-b border-gray-900/10 pb-3">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
            Add Birthday
            </h2>

            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                Photo
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

                 
                  <input onChange={handleFileChange} type="file" name="photo-file" 
                  className="file-input file-input-bordered file-input-xs w-full max-w-xs"/>
                  <br /><br/>
                  {/* <button
                    type="submit"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Upload Image
                  </button> */}
               


                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-3">
            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  First name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    id="first-name"
                    autoComplete="given-name"
                    onChange={(e) => handleChange(e)}
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
                    name="last_name"
                    value={formData.last_name}
                    id="last-name"
                    autoComplete="family-name"
                    onChange={(e) => handleChange(e)}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    id="last-name"
                    autoComplete="address"
                    onChange={(e) => handleChange(e)}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="birthday"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                Birthday
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
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

        <div className="m-5 flex items-center justify-center gap-x-6">
          <Link to="/user">
            <button
              type="button"
              className="btn btn-outline"            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="btn btn-outline"          >
            Add Birthday
          </button>
        </div>
      </form>
    </div>
  )
}
