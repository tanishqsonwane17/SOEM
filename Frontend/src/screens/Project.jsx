import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaUserGroup } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import axiosInstance from "../config/Axios";
import { UserContext } from "../context/User.contenxt";
import Markdown from 'markdown-to-jsx'
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import Editor from "@monaco-editor/react";
import { initializeWebContainer } from "../config/WebContainers";
import { VscRunAll } from "react-icons/vsc";
import stripAnsi from "strip-ansi";
import '../App.css'
import '../css/Project.css'
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
  const [status, setStatus] = useState(""); 
const [showOutput, setShowOutput] = useState(false);
  const [issidePanelOpen, setissidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const { user } = useContext(UserContext);
 const [fileTree, setFileTree] = useState({ })
const [currentFile, setCurrentFile] = useState(null)
const [iframe, setIFrame] = useState(null)
const [openFiles, setopenFiles] = useState([])
  const bottomRef = useRef(null);
const [webContainer, setWebContainer] = useState(null)
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
  const setup = async () => {
    if (!webContainer) {
      const container = await initializeWebContainer();
      setWebContainer(container);
      console.log("WebContainer started");
  

    }
  };
  setup();
}, [webContainer]);


  useEffect(() => {


    if (!project?._id || !user?._id) return;
    const newSocket = initializeSocket(project._id);
    receiveMessage("project-message", (data) => {
     let message = data.message;
try {
  if (typeof message === "string" && message.trim().startsWith("{")) {
    message = JSON.parse(message);
    webContainer?.mount(message.fileTree)
  }
} catch (e) {
  console.log("Error parsing message:", e);
}
      if(message.fileTree){
        setFileTree(message.fileTree)
      }
      if(message.currentFile){
        setCurrentFile(message.currentFile)
      }
      if(message.openFiles){
        setopenFiles(message.openFiles)
      }
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
useEffect(() => {
  console.log("Updated fileTree:", fileTree);
}, [fileTree]);

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
      className={` overflow-y-hidden  p-2 rounded-md ${
        isOwn
          ? "bg-[#454545] text-white"
          : isAI
          ? "bg-[#38383897] text-white"
          : "bg-[#515050] text-black"
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
      <section className="left relative flex flex-col h-full w-full md:w-[20rem] bg-[#2f2f2f]">
        <header className="flex justify-between items-center p-4 bg-[#1f1f1f] text-white">
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
        <div className="message-box flex-grow overflow-y-auto p-4 space-y-3 scrollbar-hide">
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
  } break-words whitespace-pre-wrap overflow-hidden rounded-md`}>
  <div
    className={`p-2 rounded-md shadow-md ${
      isOwn
        ? "!bg-[#515151] text-white"
        : isAI
        ? "!bg-[#595959] text-white"
        : "!bg-[#a3a3a367] text-black"
    }`}
  >
    <small className="text-xs text-gray-200 font-bold">
      {isOwn ? "You" : msg.sender?.email || "Unknown"}
    </small>

    {/* Yaha test karke dekho */}
    {/* Agar WriteAiMessage bg white kar raha hai to replace with simple text */}
    <div className="mt-1 break-words">
      {WriteAiMessage ? WriteAiMessage(msg.message, isOwn, isAI) : msg.message}
    </div>
  </div>
</div>

           );
         })}
            <div ref={bottomRef}></div>
          </div>

          <div className="w-full p-2 bg-[#a3a3a367] flex gap-2 bottom-0">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Type your message.. or @ai"
              className="bg-[#20202090] p-2 px-4 w-full text-white text-sm border-gray-300 rounded-md outline-none"
            />
            <button
              onClick={send}
              className="p-2 bg-[#1e1e1eab] hover:bg-[#202020] rounded-md text-white cursor-pointer"
            >
              <IoMdSend className="text-2xl" />
            </button>
          </div>
        </div>

        <div>   
       <div className={`absolute top-0 left-0 h-full w-full bg-[#484848f8] z-50 transition-transform duration-300 ease-in-out ${
            issidePanelOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <header className="flex justify-between p-2 bg-[#1f1f1f] items-center">
            <h1 className="text-sm font-bold text-white uppercase">
              Collaborators
            </h1>
            <button
              className="cursor-pointer"
              onClick={() => setissidePanelOpen(false)}
            >
              <i className="ri-arrow-left-s-line text-3xl text-white"></i>
            </button>
          </header>
          <div className="users">
            {project.users &&
              project.users.map((users) => (
                <div
                  key={users._id}
                  className="user hover:text-white flex gap-2 items-center cursor-pointer hover:bg-[#2f2f2f] p-4">
                  <div className="h-8 w-8 rounded-full bg-[#1f1f1f] flex items-center justify-center">
                    <i className="ri-user-3-fill text-white"></i>
                  </div>
                  <h2 className="font-semibold text-md text-white ">
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
     <section className="right h-full w-full flex-grow flex  bg-[#282828]">
      <div className="explorer h-full pt-1 min-w-52 max-w-64 bg-[#262626]">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  if (!openFiles.includes(file)) {
                    setopenFiles(prev => [...prev, file]);
                  }
                }}
                className="treeElem cursor-pointer px-1 flex items-center bg-[#282828] text-white w-full"
              >
                <p 
                className="font-semibold active:bg-[#272727] bg-[#1d1d1d7e] flex items-center mt-1 border-b-[1px] border-[#939393]  justify-center h-14 w-full ">{file}</p>
              </button>
            ))}
      </div>
      {currentFile && (
      <div className="codeEditor flex flex-col flex-grow h-full">
          <div className="top justify-between  flex  w-full gap-[1px]">
            <div className="flex w-full py-4 border-b-1 ">
  {openFiles.map((file, index) => (
    <button
      key={index}
      onClick={() => setCurrentFile(file)}
      className={`open-file cursor-pointer border-r border-r-[#939393] flex justify-center items-center px-4 gap-2 flex-1 ${
        currentFile === file
          ? "bg-[#262626] text-white"
          : "bg-[#262626] text-white"
      }`}
    >
      <p className="font-semibold text-center break-words">{file}</p>
    </button>
  ))}
</div>

            <div className="actions flex gap-2">

              <div className="actions flex flex-col items-center gap-2">
  {status && (
    <div className="text-xs text-gray-300 font-mono">{status}</div>
  )}
 <button
  onClick={() => {
    if (iframe) {
      setShowOutput(true);
    } else {
      setStatus("⚠️ No server running yet. Run project first.");
    }
  }}
  className="p-2 px-4 bg-[#4646467e] text-white "
>
  See
</button>

</div>

<button
  onClick={async () => {
    try {
      setStatus("Mounting files...");
      await webContainer.mount(fileTree);

      setStatus("Installing dependencies...");
      const installProcess = await webContainer.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log("install:", stripAnsi(chunk));
          },
        })
      );

      const exitCode = await installProcess.exit;
      if (exitCode !== 0) {
        setStatus("❌ Installation failed");
        return;
      }

      setStatus("Starting server...");
      const runProcess = await webContainer.spawn("npm", ["start"]);
      runProcess.output.pipeTo(
        new WritableStream({
          write(chunk) {
            console.log("start:", stripAnsi(chunk));
          },
        })
      );

      webContainer.on("server-ready", (port, url) => {
  console.log(port, url);
  setIFrame(url);
  setStatus("✅ Server is running - Click 'View Output'");
});

    } catch (err) {
      console.error(err);
      setStatus("❌ Error occurred");
    }
  }}
  className="p-2 px-4 bg-[#4646467e] text-white "
>
  <VscRunAll />
</button>


            </div>
          </div>
       <div className="bottom flex flex-grow"> 
        {fileTree[currentFile] && (
       <Editor
  height="100%"
  defaultLanguage="javascript"
  value={
    fileTree[currentFile]?.file?.contents
      ? fileTree[currentFile].file.contents.replace(/\\n/g, "\n")
      : ""
  }
  onChange={(value) => {
    setFileTree({
      ...fileTree,
      [currentFile]: {
        file: {
          contents: value || "",
        },
      },
    });
  }}
  theme="vs-dark"
/>

        )}
       </div>
      </div>
        )}
        {iframe && !showOutput && (
  <button
    onClick={() => setShowOutput(true)}
    className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
  >
    View Output
  </button>
)}
        {iframe && webContainer && <iframe src={iframe} className="w-1/2 h-full"></iframe>}
       </section>

    </main>
  );
};

export default Project;
