import { useEffect } from "react"
import axios from "axios"

export default function Logout() {
    useEffect(() => {
        (async () => {
            try {
                // eslint-disable-next-line no-unused-vars
                await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/logout/`,
                    {
                        refresh_token: localStorage.getItem("refresh_token"),
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("access_token")}`
                        }
                    },
                    {
                        withCredentials: true
                    }
                )
                localStorage.clear()
                console.log("Logout successful")
                axios.defaults.headers.common["Authorization"] = null
                window.location.href = "/"
                } catch (e) {
                    console.log("logout not working", e)
                }
            })()
    }, [])
    return <div></div>
}