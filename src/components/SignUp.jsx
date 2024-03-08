import axios from "axios";
import { useState } from "react";
import { useUsers } from "../context/UserContext";

export default function SignUp() {
  // const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
    error: "",
  });
  const { setUsername: setContextUsername } = useUsers();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // console.log(e.target.value)
  };

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
    e.preventDefault();
    const user = {
      username: formData.username,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      password2: formData.password2,
    };

    setContextUsername(user.username);

    if (formData.password !== formData.password2) {
      setFormData({ ...formData, error: "Passwords don't match" });
      console.log("Password not matching", formData);
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register/`,
        user,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Signup successful", data);

      const loginData = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/token/`,
        {
          username: formData.username,
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      localStorage.clear();
      localStorage.setItem("username", data.username);
      localStorage.setItem("access_token", loginData.data.access);
      localStorage.setItem("refresh_token", loginData.data.refresh);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${loginData.data["access"]}`;
      console.log("Logged in");

      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/userprofiles/`,
        { username: formData.username },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loginData.data.access}`, // Include access token in the request headers
          },
        },
        {
          withCredentials: true,
        }
      );
      console.log("User profile created successfully");

      window.location.href = "/";
    } catch (error) {
      console.error("Error during signup", error);
      console.log(error.request.response);
      // setErrorMessage(formatErrorMessage(JSON.parse(error.request.response)))
      console.log(formData);
    }
  };

  return (
    <>
      <div className="w-full max-w-xs mt-6">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 rounded-box"
          onSubmit={handleSubmit}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="grid-first-name"
            >
              First Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grid-first-name"
              type="text"
              placeholder="Jane"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <p className="text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="grid-username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grid-username"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="grid-email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grid-email"
              type="email"
              placeholder="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="grid-password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grid-password"
              type="password"
              placeholder="******************"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="grid-password2"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="grid-password2"
              type="password"
              placeholder="******************"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-neutral" type="submit">
            Sign Up
          </button>

          {/* <p>{errorMessage}</p> */}
        </form>
      </div>
    </>
  );
}
