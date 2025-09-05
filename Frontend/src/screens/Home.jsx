import React, { useContext, useState, useEffect} from 'react'
import { UserContext } from '../context/User.contenxt'
import { FaLink } from "react-icons/fa6"
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../config/Axios'
import { MdPeopleAlt } from "react-icons/md";

const Home = () => {
  const [project, setproject] = useState([])
  const navigate = useNavigate()
useEffect(() => {
  axiosInstance.get('/projects/all')
    .then((res) => {
      setproject(res.data.projects)
    })
    .catch((err) => {
      console.error("Error fetching projects:", err)
    })
}, [])
  return (
    <>
      <main className='p-4 h-screen w-full bg-[#323232]'>
        <div className="projects flex gap-4 flex-wrap">
          <button
            className="project p-4 flex gap-2 border bg-[#414141] text-white cursor-pointer border-[#e6e6e6] rounded-md ">
            <Link to={'/create-project'} className='text-md'>New Project</Link>
            <FaLink />
          </button>
          {
            project?.map((item) => (
              <div key={item._id}
              onClick={() => navigate(`/project`,{
                state:{
                  project
                }
              })}
              className="
              project py-6 px-6 flex-col flex gap-4 border bg-[#414141] text-white border-[#e6e6e6] rounded-md cursor-pointer ">
                <h2 className='text-semibold '>{item.name}</h2>
                <div className='flex gap-2'>
                <MdPeopleAlt className='mt-1 text-sm'/><small className='text-sm'>Collaborators:</small> <span className='text-md'>{ item.users?.length || 0 }</span>
                </div>
              </div>
            ))
          }
        </div>
      
      </main>
    </>
  )
}

export default Home
