import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./EditWish.css";

export default function EditWish() {
  // const token = localStorage.getItem("access_token");
  const [wish, setWish] = useState({});
  const [wishImages, setWishImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { id, username } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    reserved: false,
    priority: "",
  });

  async function fetchData() {
    try {
      const singleWish = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, 
          },
        }
      );
      setWish(singleWish.data);
      setFormData({
        name: singleWish.data.name,
        url: singleWish.data.url,
        description: singleWish.data.description,
        reserved: singleWish.data.reserved,
        priority: singleWish.data.priority,
      });
      // console.log(singleWish.data);
      setWishImages([]);

      if (singleWish.data.images && singleWish.data.images.length > 0) {
        for (let i = 0; i < singleWish.data.images.length; i++) {
          try {
            const imagesResponse = await axios.get(
              `${process.env.REACT_APP_BACKEND_URL}/photos/${singleWish.data.images[i]}`,
              {
                headers: {
                  "Content-Type": "application/json",
                  // Authorization: `Bearer ${token}`,
                },
              }
            );
            const imagesData = imagesResponse.data;
            // console.log(imagesData);
            setWishImages((prevImages) => [...prevImages, imagesData]);
            // console.log(wishImages);
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        // console.log("No images");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/photos/${imageId}/delete/`,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object to append the selected file
    const formData = new FormData();
    formData.append("photo-file", selectedFile);

    try {
      // Send a POST request to upload the photo
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/wish/${wish.id}/add_photo/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // Authorization: `Bearer ${token}`, 
          },
        }
      );
      fetchData();
      // Optionally, perform additional actions after successful upload
      console.log("Photo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    console.log(formData);
  };

  async function saveEdit(formData, e) {
    e.preventDefault();
    const body = {
      name: formData.name,
      url: formData.url,
      description: formData.description,
      reserved: formData.reserved,
      priority: formData.priority,
    };
    // console.log(body);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}/`,
        body,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setWish((prevWish) => ({
          ...prevWish,
          ...body,
        }));
        setFormData(body);
        console.log("Form submitted successfully");
      }
    } catch (error) {
      console.error(error);
    }
    navigate(-2);
  }

  async function deleteWish() {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}/`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`, // Include access token in the request headers
        //   },
        //   withCredentials: true,
        // }
      );
      if (response.status === 204) {
        console.log("wish deleted");
        navigate(-2);
      }
    } catch (error) {
      console.error(error);
      // Handle error if deletion fails
    }
  }

  return (
    <div>
      <h5 className="mb-3">{wish.name}</h5>
      <p>Add photos</p>
      <div className="fileInputWrapper">
        <form onSubmit={handleSubmit}>
          <input name="photo-file" onChange={handleFileChange} type="file" className="file-input file-input-bordered file-input-xs w-full max-w-xs" />
          <br />
          <br />
          {selectedFile ? (
            <button type="submit" className="btn btn-xs mb-3">
              Upload Photo
            </button>
          ) : (
            <></>
          )}
        </form>
      </div>

      <div id="wishesGrid" className="grid grid-cols-3 mt-4">
        {wishImages.length > 0 ? (
          wishImages.map((image) => (
            <div key={image.id}>
              <div className="indicator">
                <span
                  id="delImageX"
                  onClick={() => handleDeleteImage(image.id)}
                  className="indicator-item badge badge-secondary"
                >
                  x
                </span>

                <img src={image.url} alt="" width="90vmin" />
              </div>
            </div>
          ))
        ) : (
          <>
          <div className="avatar placeholder" >
            <div className="bg-neutral text-neutral-content w-24 h-24 rounded h-16">
              <p>No Image</p>
              <p>👀</p>
            </div>
          </div>
  
      </>
          
          
        )}
      </div>

      <form onSubmit={(e) => saveEdit(formData, e)}>
        <div className="">
          <div className="border-b border-gray-900/10 pb-3 mt-3">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Edit Wish
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly.
            </p>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="col-span-full">
              <label className="form-control">
                  <div className="label">
                    <span className="label-text">Description</span>
                    <span className="label-text-alt">(Optional)</span>
                  </div>
                  <textarea className="textarea textarea-bordered h-24" 
                  placeholder="Description"
                  type="text"
                  name="description"
                  value={formData.description}
                  id="description"
                  autoComplete="description"
                  onChange={(e) => handleChange(e)}
                  ></textarea>
                </label>
              </div>

              <div className="flex items-center mb-4">
                <input
                  id="reserved"
                  type="checkbox"
                  checked={formData.reserved}
                  name="reserved"
                  autoComplete="reserved"
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      reserved: e.target.checked,
                    }))
                  }
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
                <div className="mt-2 mb-2">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    autoComplete="priority"
                    onChange={handleChange}
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

        <div className="mt- flex items-center justify-center gap-x-6 m-3">
          {/* <Link to={`/wishlist/wish/${username}/${wish.id}`}> */}
          <Link to={`/wishlist/wish/${username}/${id}`}>
            <button className="btn btn-outline">Back</button>
          </Link>
          <button type="submit" className="btn btn-outline">
            Save
          </button>
        </div>
      </form>

      <button
        type="button"
        className="btn btn-outline btn-warning m-2"
        onClick={deleteWish}
      >
        Delete Wish
      </button>
    </div>
  );
}
