import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserGroup } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";

const Project = () => {
  const location = useLocation();
  const [issidePanelOpen, setissidePanelOpen] = useState(false);
  const { project } = location.state || {};

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full w-[20rem] bg-slate-300">

        {/* Header */}
        <header className="flex items-center justify-end p-4 bg-slate-100">
          <button
            onClick={() => setissidePanelOpen(true)}
            className="rounded-md cursor-pointer"
          >
            <FaUserGroup className="text-xl" />
          </button>
        </header>

        {/* Chat Area */}
        <div className="flex flex-col justify-between flex-grow">

          {/* Messages */}
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

          {/* Input */}
          <div className="w-full p-2 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Enter message"
              className="bg-gray-100 p-2 px-4 w-full  border-gray-300 rounded-md outline-none"
            />
            <button className="p-2 bg-black hover:bg-slate-800 cursor-pointer rounded-md text-white cursor-pointer">
              <IoMdSend className="text-2xl" />
            </button>
          </div>
        </div>
        <div className={`absolute top-0 left-0 h-full w-full bg-slate-400 z-50 transition-transform duration-300 ease-in-out ${issidePanelOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <header className="flex justify-end p-2 bg-slate-200">
            <button className='cursor-pointer' onClick={() => setissidePanelOpen(false)}>
             <i className="ri-arrow-left-s-line text-3xl text-gray-500"></i>
            </button>
          </header>
          <div className="users">
          <div className="user flex gap-2 items-center cursor-pointer hover:bg-slate-500 p-4">
            <div className='h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center'>
              <i className="ri-user-3-fill text-gray-600"></i>
            </div>
            <h2 className='font-semibold text-lg text-white'>Bixi</h2>
          </div>
          </div>
          <div className="p-4 text-white">
          </div>
        </div>
      </section>
    </main>
  );
};

export default Project;
