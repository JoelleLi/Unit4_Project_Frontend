import axios from "axios";
import { useState } from "react";
import { useUsers } from "../context/UserContext";

export default function Login() {
  const [password, setPassword] = useState("");

  const { username, setUsername } = useUsers();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: username,
      password: password,
    };

    const { data } = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/token/`,
      user,
      {
        headers: { "Content-Type": "application/json" },
      },
      {
        withCredentials: true,
      }
    );

    localStorage.clear();
    localStorage.setItem("username", username);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    axios.defaults.headers.common["Authorization"] = `Bearer ${data["access"]}`;
    window.location.href = "/";
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
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="username"
              name="username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              name="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p>
          </div>

          <button className="btn btn-neutral" type="submit">
            Log In
          </button>

        </form>
      </div>
    </>
  );
}
