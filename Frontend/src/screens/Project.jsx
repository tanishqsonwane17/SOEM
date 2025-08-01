import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import axiosInstance from "../config/Axios";
import { UserContext } from "../context/User.contenxt";
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/Socket";

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
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { user } = useContext(UserContext);
 const [fileTree, setFileTree] = useState({
      "app.js":{
        content:"const epxress  =  require('express')",
      },
      "package.json":{
        content:`{
        "name" : "temp-server",
        }`
      }
 })
const [currentFile, setCurrentFile] = useState(null)
  const bottomRef = useRef(null);

  const handleUserSelect = (id) => {
    setSelectedUserId((prev) => {
      const updated = new Set(prev);
      updated.has(id) ? updated.delete(id) : updated.add(id);
      return Array.from(updated);
    });
  };

  const send = () => {
    if (!message.trim()) return;

    const msgObj = {
      message,
      sender: {
        id: user._id,
        email: user.email,
      },
    };

    sendMessage("project-message", msgObj);
    setChatMessages((prev) => [...prev, msgObj]);
    setMessage("");
  };

  useEffect(() => {
    if (!project?._id || !user?._id) return;

    const newSocket = initializeSocket(project._id);

    receiveMessage("project-message", (data) => {
      setChatMessages((prev) => [...prev, data]);
    });

    axiosInstance
      .get(`/projects/get-project/${project._id}`)
      .then((res) => setProject(res.data.project))
      .catch((err) => console.error("Project fetch error:", err));

    axiosInstance
      .get("/users/all")
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error("User fetch error:", err));

    return () => {
      newSocket.disconnect();
    };
  }, [project?._id, user?._id]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const AddCollaborator = () => {
    if (!project?._id) return;
    axiosInstance
      .put("/projects/add-user", {
        projectId: project._id,
        users: selectedUserId,
      })
      .then(() => {
        setIsModalOpen(false);
      })
      .catch((err) => console.error("Error adding collaborators:", err));
  };


function getTextFromMessage(message) {
  
  // Step 1: Check if message is valid JSON
  try {
    const parsed = JSON.parse(message);
    return parsed?.text || message; // If JSON has text, return it. Else fallback
  } catch {
    // Step 2: Try to handle poor format like 'text: hello'
    if (message.startsWith("text:")) {
      return message.slice(5).trim();
    }
    return message;
  }
}

function WriteAiMessage(message, isOwn, isAI) {
  const safeText = getTextFromMessage(message);

  return (
    <div
      className={`overflow-auto p-2 rounded-md ${
        isOwn
          ? "bg-gray-200 text-black"
          : isAI
          ? "bg-slate-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <Markdown
        children={safeText}
        options={{
          overrides: {
            code: SyntaxHighlighter,
          },
        }}
      />
    </div>
  );
}

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full w-full md:w-[20rem] bg-slate-300">
        <header className="flex justify-between items-center p-4 bg-slate-100">
          <button
            className="flex gap-1 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-user-add-line mr-1"></i>
            <p>Add Collaborator</p>
          </button>
          <button
            onClick={() => setissidePanelOpen(!issidePanelOpen)}
            className="rounded-md cursor-pointer"
          >
            <FaUserGroup className="text-xl" />
          </button>
        </header>
        {/* Chat Section */}
        <div className="flex flex-col justify-between flex-grow h-[90%]">
          <div className="message-box flex-grow overflow-y-auto p-4 space-y-3">
         {chatMessages.map((msg, index) => {
           const isOwn =
             msg.sender === user._id ||
             msg.sender?.id === user._id ||
             msg.sender?._id === user._id;
         
           const isAI =
             msg.sender === "AI" || msg.sender?.id === "ai" || msg.sender?.email === "AI";

             return (
                <div
                 key={index}
                 className={`${
                   isOwn
                     ? "ml-auto max-w-[80%]"
                     : isAI
                     ? "mr-auto max-w-96"
                     : "mr-auto max-w-[70%]"
                 } break-words whitespace-pre-wrap overflow-hidden rounded-md`}
               >
               ...
             <div
               className={`p-1  rounded-md shadow-md ${
                 isOwn
                   ? "bg-slate-100 text-white"
                   : isAI
                   ? "bg-gray-100 text-black"
                   : "bg-white text-black"
               }`}
             >
               <small className="text-xs text-gray-500">
                 {isOwn ? "You" : msg.sender?.email || "Unknown"}
               </small>
             
               {WriteAiMessage(msg.message, isOwn, isAI)}
             
               {/* Remove this line ⛔ */}
               {/* {msg.message} */}
             </div>
             </div>
           );
         })}
            <div ref={bottomRef}></div>
          </div>

          {/* Message Input */}
          <div className="w-full p-2 bg-white flex gap-2 bottom-0">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type your message... or use @ai"
              className="bg-gray-100 p-2 px-4 w-full border-gray-300 rounded-md outline-none"
            />
            <button
              onClick={send}
              className="p-2 bg-black hover:bg-slate-800 rounded-md text-white cursor-pointer"
            >
              <IoMdSend className="text-2xl" />
            </button>
          </div>
        </div>

        <div>   
       <div className={`absolute top-0 left-0 h-full w-full bg-slate-300 z-50 transition-transform duration-300 ease-in-out ${
            issidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-between p-2 bg-slate-100 items-center">
            <h1 className="text-sm font-bold text-gray-800 uppercase">
              Collaborators
            </h1>
            <button
              className="cursor-pointer"
              onClick={() => setissidePanelOpen(false)}
            >
              <i className="ri-arrow-left-s-line text-3xl text-gray-500"></i>
            </button>
          </header>
          <div className="users">
            {project.users &&
              project.users.map((users) => (
                <div
                  key={users._id}
                  className="user hover:text-white flex gap-2 items-center cursor-pointer hover:bg-slate-400 p-4"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <i className="ri-user-3-fill text-gray-500"></i>
                  </div>
                  <h2 className="font-semibold text-md text-black">
                    {users.email}
                  </h2>
                </div>
              ))}
          </div>
        </div>

        </div>
        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.15)" }}
          >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Select Users</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <ul className="overflow-y-auto" style={{ maxHeight: "45vh" }}>
                {users.map((user) => (
                  <li
                    key={user._id}
                    className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                      selectedUserId.includes(user._id) ? "bg-slate-200" : ""
                    } hover:bg-slate-200 transition`}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <i className="ri-user-3-fill text-gray-600"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">{user.email}</h3>
                      <small className="text-xs text-gray-500">
                        {user.email}
                      </small>
                    </div>
                  </li>
                ))}
              </ul>

              {selectedUserId.length > 0 && (
                <div className="mt-4 text-sm text-green-600 space-y-1">
                  <h4 className="font-semibold">Selected Users:</h4>
                  {users
                    .filter((user) => selectedUserId.includes(user._id))
                    .map((user) => (
                      <div key={user._id} className="text-gray-700">
                        {user.email}
                      </div>
                    ))}
                </div>
              )}

              <button
                onClick={AddCollaborator}
                className="mt-4 w-full bg-black text-white py-3 rounded-lg font-semibold"
              >
                Add Collaborators
              </button>
            </div>
          </div>
        )}
      </section>
     <section className="right h-full w-full flex-grow flex  bg-gray-200">
      <div className="explorer h-full min-w-52 max-w-64 bg-[#dee4ec]">
        <div className="fileTree">
          {Object.keys(fileTree).map((file,index) => (
             <button
             onClick={() => setCurrentFile(file)}
             key={index} className="treeElem cursor-pointer p-2 flex items-center px-4 gap-2 bg-slate-300 w-full">
            <p className=" font-semibold">{file}</p>
          </button>

          ))}
        </div>
      </div>
      {currentFile && (
      <div className="codeEditor">
       <div className="top">
        <h1 className="text-lg font-semibold">{currentFile}</h1>
       </div>
       <div className="bottom">
        {fileTree[currentFile] && (
         <textarea
           value={fileTree[currentFile]?.content || ""}
           onChange={(e) => {
             setFileTree({
               ...fileTree,
               [currentFile]: {
                 content: e.target.value
               }
             })
           }}
           className="w-full h-full p-4 bg-slate-500 text-white"
         />
        )}
       </div>
      </div>
        )}
       </section>

    </main>
  );
};

export default Project;
