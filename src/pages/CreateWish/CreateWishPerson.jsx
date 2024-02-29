import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { usePersons } from "../../context/PersonContext"

import '../../App.css'
import axios from "axios"

export default function CreateWishPerson({ userDetails }) {
    const token = localStorage.getItem("access_token")
    const [setFormSubmitted] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState([])
    const { personId } = usePersons()
    const [formData, setFormData] = useState({})

    const navigate = useNavigate()
    
    const handleFileChange = (event) => {
      setSelectedFiles([...selectedFiles, ...event.target.files])
    }
  
    function handleChange(e) {
      const { name, value, type, checked } = e.target
      const reservedValue = type === 'checkbox' ? checked : value
      setFormData(prevFormData => ({ ...prevFormData, [name]: reservedValue }))
      console.log(formData)
    }

    async function addWish(formData, e) {
        e.preventDefault()
    
        if (!formData.priority) {
          alert('Please select a priority for the wish.');
          return;
        }
        const body = {
          name: formData.name,
          url: formData.url,
          description: formData.description,
          reserved: formData.reserved,
          priority: formData.priority,
          user: userDetails.id,
          person: personId
        }
    
        try {
          const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/wishlist/add/${personId}/`, body,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // Include access token in the request headers
            }, 
            withCredentials: true
          })
          if (response) {      
            setFormSubmitted(true) 
            console.log("Form submitted successfully", body)
            console.log(response.data.id)
    
          const newWishId = response.data.id
    
          const uploadPromises = selectedFiles.map(file => {
            const photoFormData = new FormData();
            photoFormData.append('photo-file', file);
    
            return axios.post(`${process.env.REACT_APP_BACKEND_URL}/wish/${newWishId}/add_photo/`, photoFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${token}` // Include access token in the request headers
              }
            });
          });
    
          await Promise.all(uploadPromises);
    
          console.log('Photos uploaded successfully!');
        }
    
          }catch (error) {
            console.error('Error uploading photo:', error);
            console.log(body)
        }
        navigate(`/wishlist/person/${personId}`)
    
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

                 
                  <input type="file" name="photo-file" onChange={handleFileChange} multiple/>
                  <br /><br/>
                  <button
                    type="submit"
                    className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Upload Image
                  </button>
               


                </div>
              </div>
            </div>
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
                    value={formData.url}
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
                    value={formData.description}
                    id="description"
                    autoComplete="description"
                    onChange={(e) => handleChange(e)}
                    className="large-input block w-full px-2 rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

             <div className="flex items-center mb-4">
                <input
                  id="reserved"
                  type="checkbox"
                  value={formData.reserved}
                  name="reserved"
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="reserved"
                  className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Reserved
                </label>
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
                    onChange={(e) => handleChange(e)}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option value="">Select a priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">Desparately Need!</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt- flex items-center justify-end gap-x-6">
          <Link to={`/wishlist/person/${personId}`}>
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
