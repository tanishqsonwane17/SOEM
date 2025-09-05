import React, { useContext, useState, useEffect} from 'react'
import { UserContext } from '../context/User.contenxt'
import { FaLink } from "react-icons/fa6"
import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '../config/Axios'
import { MdPeopleAlt } from "react-icons/md";

const Home = () => {
  const { user } = useContext(UserContext)
  const [isModal, setisModal] = useState(false)
  const [projectName, setprojectName] = useState('') 
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

  function createProject(e) {
    e.preventDefault()
    console.log({projectName})
    axiosInstance.post('/projects/create', {
      name:projectName
    }).then((res)=>{
    }).catch((err)=>{
      console.log("Error creating project:", err)
    })
  }

  return (
    <>
      <main className='p-4'>
        <div className="projects flex gap-4 flex-wrap">
          <button
            onClick={() => setisModal(true)}
            className="project p-4 flex gap-2 border border-slate-400 rounded-md cursor-pointer">
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
              project p-4 flex-col flex gap-2 border hover:bg-gray-100 border-slate-400 rounded-md  cursor-pointer
              ">
                <h2 className='text-semibold '>{item.name}</h2>
                <div className='flex gap-2'>
                <MdPeopleAlt className='mt-1 text-sm'/><small className='text-sm'>Collaborators:</small> <span className='text-md'>{ item.users?.length || 0 }</span>
                </div>
              </div>
            ))
          }
        </div>
        {isModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
              <form onSubmit={createProject}>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Project Name
                  <input
                    type="text"
                    onChange={(e) => setprojectName(e.target.value)}
                    value={projectName}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setisModal(false)} 
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default Home
