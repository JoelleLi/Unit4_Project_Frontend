import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useUsers } from "../../context/UserContext"
import '../../App.css'
import axios from "axios"

export default function CreateWish({ userDetails }) {
  const token = localStorage.getItem("access_token")
  const [formSubmitted, setFormSubmitted] = useState(false)
  const { username } = useUsers()
  const [formData, setFormData] = useState({})

  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setFormData(prevFormData => ({ ...prevFormData, [name]: newValue }))
    console.log(formData)
  }

  async function addWish(formData, e) {
    e.preventDefault()
    const body = {

    }
    console.log(body)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/wishlist/add/`, body,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include access token in the request headers
        }, 
        withCredentials: true
      })
      if (response.status === 200) {
     
      setFormData(body)
      setFormSubmitted(true) 
      console.log("Form submitted successfully", body)
    }
    } catch (error) {
      console.error(error)
    }
    navigate(`/people`)

  }

  return (
    <div>
        <form onSubmit={(e) => addWish(formData, e)}>
        <div className="">
          <div className="border-b border-gray-900/10 pb-3">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add a Wish
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
                Add Image
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

              <div className="col-span-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                Wish Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    id="name"
                    autoComplete="name"
                    onChange={(e) => handleChange(e)}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                Link (optional)
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="url"
                    value={formData.name}
                    id="url"
                    autoComplete="url"
                    onChange={(e) => handleChange(e)}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                Description (optional)
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="description"
                    value={formData.name}
                    id="description"
                    autoComplete="description"
                    onChange={(e) => handleChange(e)}
                    className="large-input block w-full px-2 rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div class="flex items-center mb-4">
                <input id="reserved" type="checkbox" 
                checked={formData.reserved}
                onChange={(e) => handleChange(e)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                <label for="reserved" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Reserved</label>
              </div>

              <div className="sm:col-span-full">
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                Priority
                </label>
                <div className="mt-2">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    autoComplete="priority"
                    onChange={(e) => handleChange(e)}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>...</option>
                    <option>Desparately Need!</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt- flex items-center justify-end gap-x-6">
          <Link to={`/wishlist/${username}`}>
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
