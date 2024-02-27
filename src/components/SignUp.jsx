import axios from "axios"
import { useState } from 'react'
import { useUsers } from "../context/UserContext"

export default function SignUp() {
    const [errorMessage, setErrorMessage] = useState("")
    const [formData, setFormData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password2: "",
        error: ""
    })
    const { setUsername: setContextUsername } = useUsers()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        // console.log(e.target.value)
    }

    // const formatErrorMessage = (errorResponse) => {
    //     let formattedMessage = "";
    //     // Loop through the error response object and format the error messages
    //     for (const key in errorResponse) {
    //         if (errorResponse.hasOwnProperty(key)) {
    //             // Get the field name from the key
    //             const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ");
    //             // Concatenate the error messages with the field name
    //             formattedMessage += `${fieldName}: ${errorResponse[key].join(", ")}\n\n`;
    //         }
    //     }
    //     return formattedMessage;
    // };

    const handleSubmit = async (e) => {
        e.preventDefault()
        const user = {
            username: formData.username,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
            password2: formData.password2
        }

        setContextUsername(user.username)

        if (formData.password !== formData.password2) {
            setFormData({ ...formData, error: "Passwords don't match"})
            console.log("Password not matching", formData)
            return
        } 

        try {
            const { data } = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/register/`, user,
            {
                headers: { "Content-Type": "application/json" },
            },
            )
            console.log("Signup successful", data)

            const loginData = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/token/`, {
                username: formData.username,
                password: formData.password
            }, {
                headers: { "Content-Type": "application/json" }
            })
    
            localStorage.clear()
            localStorage.setItem('username', data.username)
            localStorage.setItem("access_token", loginData.data.access)
            localStorage.setItem("refresh_token", loginData.data.refresh)
            axios.defaults.headers.common["Authorization"] = `Bearer ${loginData.data["access"]}`
            console.log("Logged in")


            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/userprofiles/`, {username: formData.username}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${loginData.data.access}` // Include access token in the request headers
                },
            }, {
                withCredentials: true
            });
            console.log("User profile created successfully")

            window.location.href = "/"
            
        } catch (error) {
            console.error("Error during signup", error)
            console.log(error.request.response)
            // setErrorMessage(formatErrorMessage(JSON.parse(error.request.response)))
            console.log(formData)
        }
    }

  return (
    <div>
        <div>SignUp</div>
        <form className="w-full max-w-lg" onSubmit={handleSubmit} >
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                    First Name
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" 
                id="grid-first-name" type="text" placeholder="Jane" name="firstName" value={formData.firstName} onChange={handleChange} />
                <p className="text-red-500 text-xs italic">Please fill out this field.</p>
                </div>
                <div className="w-full md:w-1/2 px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                    Last Name
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                id="grid-last-name" type="text" placeholder="Doe" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-username">
                    Username
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                id="grid-username" type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-email">
                    Email
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                id="grid-email" type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Password
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                id="grid-password" type="password" placeholder="******************" name="password" value={formData.password} onChange={handleChange} />
                <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password2">
                    Confirm Password
                </label>
                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" 
                id="grid-password2" type="password" placeholder="******************" name="password2" value={formData.password2} onChange={handleChange} />
                <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
                </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            type="submit">
                Sign Up
            </button>
            {/* <p>{errorMessage}</p> */}
        </form>
    </div>    
  )
}