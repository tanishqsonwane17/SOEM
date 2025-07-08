import React, { useContext, useState } from 'react'
import { UserContext } from '../context/User.contenxt'
import { FaLink } from "react-icons/fa6"
import axios from 'axios'
import axiosInstance from '../config/Axios'
const Home = () => {
  const { user } = useContext(UserContext)
  const [isModal, setisModal] = useState(false)
  const [projectName, setprojectName] = useState('') // empty string for controlled input

  function createProject(e) {
    e.preventDefault()
    console.log({projectName})
    // setisModal(false) 
    // setprojectName('')
    axiosInstance.post('/projects/create', {
      name:projectName
    }).then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }

  return (
    <>
      <main className='p-4'>
        <button className="projects">
          <div
            onClick={() => setisModal(true)}
            className="project p-4 flex gap-2 border border-slate-400 rounded-md cursor-pointer"
          >
            <span className='text-md'>New Project</span>
            <FaLink />
          </div>
        </button>

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
                    onClick={() => setisModal(false)} // ✅ fixed here
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
