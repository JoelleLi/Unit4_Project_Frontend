import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUsers } from '../../context/UserContext'
import axios from 'axios'

export default function People({isLoggedIn}) {
  const token = localStorage.getItem("access_token")
  const [peopleList, setPeopleList] = useState([])
  const { username } = useUsers()

  async function fetchData() {
    try {
        const people = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/persons/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Include access token in the request headers
          }
        }
        )
        setPeopleList(people.data)
    }
    catch (error) {
        console.log(error)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetchData()
    }
  }, [])

  function calculateAge(birthdate) {
    const today = new Date()
    const birthDate = new Date(birthdate)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age + 1
  }

  return (
    <>
    <div>People</div>

    <ul className="p-6 divide-y divide-slate-200">
      {peopleList && peopleList.map(person => (
        <Link to={`/people/${person.id}`} key={person.id}>
        <li className="flex py-4 first:pt-0 last:pb-0">
          <img className="h-10 w-10 rounded-full" src={person.image} alt="" />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-slate-900">{person.first_name} {person.last_name}</p>
            <p className="text-sm text-slate-500 truncate">{calculateAge(person.birthday)} on {new Date(person.birthday).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
          </div>
        </li>
        </Link>
        ))
      }
    </ul>
    
    <Link to="/addbirthday">
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Add Birthday
      </button>
    </Link>
    </>
  )
}
