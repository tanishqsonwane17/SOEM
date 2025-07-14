import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserGroup } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import axiosInstance from '../config/Axios';

const Project = () => {
  const location = useLocation();
  const initialProject = Array.isArray(location.state?.project)
    ? location.state.project[0]
    : location.state?.project;

  const [project, setProject] = useState(initialProject);
  const [issidePanelOpen, setissidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);

  const handleUserSelect = (id) => {
    setSelectedUserId((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return Array.from(updated);
    });
  };

  useEffect(() => {
    if (!project?._id) return;

    axiosInstance.get(`/projects/get-project/${project._id}`)
      .then((res) =>{
        console.log(res.data.project)
        setProject(res.data.project)
      }
      )
      .catch((err) => console.log(" Project fetch error:", err));

    axiosInstance.get('/users/all')
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error(" User fetch error:", err));
  }, [project?._id]);

  const AddCollaborator = () => {
    if (!project?._id) {
      console.error(" Project ID not found");
      return;
    }

    axiosInstance.put('/projects/add-user', {
      projectId: project._id,
      users: selectedUserId
    })
      .then((res) => {
        setIsModalOpen(false);
        console.log("✅ Collaborators added:", res.data);
      })
      .catch((err) => {
        console.error("❌ Error adding collaborators:", err);
      });
  };

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full w-full md:w-[20rem] bg-slate-300">
        <header className="flex justify-between items-center p-4 bg-slate-100">
          <button className='flex gap-1 cursor-pointer' onClick={() => setIsModalOpen(true)}>
            <i className="ri-user-add-line mr-1"></i>
            <p>Add Collaborator</p>
          </button>
          <button onClick={() => setissidePanelOpen(!issidePanelOpen)} className="rounded-md cursor-pointer">
            <FaUserGroup className="text-xl" />
          </button>
        </header>

        <div className="flex flex-col justify-between flex-grow">
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            <div className="incoming bg-white p-2 rounded-md w-fit max-w-[70%] shadow">
              <small className="text-xs text-gray-500">example@gmail.com</small>
              <p className="text-sm">Hello tanishq how are you?</p>
            </div>
            <div className="outgoing ml-auto bg-white p-2 rounded-md w-fit max-w-[70%] shadow">
              <small className="text-xs text-gray-500">me@gmail.com</small>
              <p className="text-sm">I'm good bro, you tell?</p>
            </div>
          </div>

          <div className="w-full p-2 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Enter message"
              className="bg-gray-100 p-2 px-4 w-full border-gray-300 rounded-md outline-none"
            />
            <button className="p-2 bg-black hover:bg-slate-800 rounded-md text-white cursor-pointer">
              <IoMdSend className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Side Panel */}
        <div className={`absolute top-0 left-0 h-full w-full bg-slate-300 z-50 transition-transform duration-300 ease-in-out ${issidePanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <header className="flex justify-between p-2 bg-slate-200  items-center">
            <h1 className='text-sm font-bold text-gray-700 uppercase'>Collaborator</h1>
            <button className='cursor-pointer' onClick={() => setissidePanelOpen(false)}>
              <i className="ri-arrow-left-s-line text-3xl text-gray-500"></i>
            </button>
          </header>
          <div className="users">
            {
              project.users && project.users.map(users=>{
                return(
                <div className="user flex gap-2 items-center cursor-pointer hover:bg-slate-500 p-4">
              <div className='h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center'>
                <i className="ri-user-3-fill text-gray-600"></i>
              </div>
              <h2 className='font-semibold text-md text-black'>{users.email}</h2>
            </div>
                )
              })
            }            
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.15)" }}>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative flex flex-col" style={{ maxHeight: '80vh' }}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select User</h2>
                <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
              </div>

              <ul className="overflow-y-auto" style={{ maxHeight: '45vh' }}>
                {users.map(user => (
                  <li
                    key={user._id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${selectedUserId.includes(user._id) ? "bg-slate-200" : ""} hover:bg-slate-200 transition`}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <i className="ri-user-3-fill text-gray-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">{user.email}</h3>
                      <small className="text-xs text-gray-500">{user.email}</small>
                    </div>
                  </li>
                ))}
              </ul>

              {selectedUserId.length > 0 && (
                <div className="mt-4 text-sm text-green-600 space-y-1">
                  <h4 className="font-semibold">Selected Users:</h4>
                  {users.filter(user => selectedUserId.includes(user._id)).map(user => (
                    <div key={user._id} className="text-gray-700">✅ {user.email}</div>
                  ))}
                </div>
              )}

              <button onClick={AddCollaborator} className="mt-4 w-full bg-black text-white py-3 rounded-lg font-semibold">
                Add Collaborators
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default Project;
