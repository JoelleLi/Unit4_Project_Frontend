import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useUsers } from "../../context/UserContext"
import { useState, useEffect } from "react"
import axios from "axios";

export default function EditWish() {
  const token = localStorage.getItem("access_token")
  const [wish, setWish] = useState({})
  const [wishImages, setWishImages] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const { username } = useUsers()
  const { id } = useParams()
  const navigate = useNavigate()

  async function fetchData() {
    try {
        const singleWish = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include access token in the request headers
          }
        }
        )
        setWish(singleWish.data)
        console.log(singleWish.data)
        setWishImages([]);


        if (singleWish.data.images && singleWish.data.images.length > 0) {
          for (let i = 0; i < singleWish.data.images.length; i++){
            try {
              const imagesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/photos/${singleWish.data.images[i]}`, {
                  headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                  }
              });
              const imagesData = imagesResponse.data
              console.log(imagesData)
              setWishImages((prevImages) => [...prevImages, imagesData]);
              console.log(wishImages)

            } catch (error) {
              console.log(error);
            }
          }
        } else {
          console.log("No images")
        }
    }
    catch (error) {
        console.log(error)
    }
  }

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/photos/${imageId}/delete/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWishImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } catch (error) {
      console.log(error);
    }
  }

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
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/wish/${wish.id}/add_photo/`, formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${token}` // Include access token in the request headers
        }
      })
      fetchData()
      // Optionally, perform additional actions after successful upload
      console.log('Photo uploaded successfully!')

    } catch (error) {
      console.error('Error uploading photo:', error)
    }
  }

  async function deleteWish() {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/wishlist/wish/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include access token in the request headers
          },
          withCredentials: true,
        }
      );
      if (response.status === 204) {
        console.log("wish deleted")
        navigate(`/wishlist/${username}`)
      }
    } catch (error) {
      console.error(error);
      // Handle error if deletion fails
    }
  }

  useEffect(() => {
    fetchData()
    
  }, [])

  return (
    <div>
      <p>{wish.name}</p>
      <p>Add photos</p>
      <form onSubmit={handleSubmit}>
        <input type="file" name="photo-file" onChange={handleFileChange} />
        <br /><br/>
        <button type="submit">Upload Photo</button>
      </form>

      <div id="wishesGrid">
        {wishImages.length > 0 ? (
          wishImages.map((image) => (
            <div key={image.id}>
              <img src={image.url} alt="" width="100vmin" />
              <button onClick={() => handleDeleteImage(image.id)}>
                Delete Image
              </button>
            </div>
          ))
        ) : (
          <div>This wish does not have an image uploaded</div>
        )}
      </div>

      <div>{wish.description}</div>
      <button type="button"
      onClick={deleteWish}>Delete Wish</button>
    </div>
  )
}
