import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CreateProject = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')

  const handleCreateProject = async () => {
    try {
    const token = localStorage.getItem("token"); 

const res = await axios.post(
  "http://localhost:3000/projects/create",
  { name },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

      console.log(res.data)
      navigate('/') // create hone ke baad navigate
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className='h-screen w-full flex justify-center items-center bg-slate-100'>
      <div className='h-[40%] w-[30%] bg-slate-200 rounded-2xl'>
        <div className='h-full w-full '>
          <h2 className='text-center p-4 text-3xl tracking-tight font-bold'>
            Create project
          </h2>
          <div className='h-40 px-20 gap-4 w-full flex justify-center items-center flex-col'>
            {/* Project Name Input */}
            <input
              type="text"
              className='border py-2 w-full px-2 rounded-sm'
              placeholder='Project name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Submit Button */}
            <button
              onClick={handleCreateProject}
              className='border bg-black text-white py-2 rounded-xl cursor-pointer w-full px-2 '
            >
              Create Project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateProject
