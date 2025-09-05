import React,{useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../context/User.contenxt'
import axios from '../config/Axios'
import { useNavigate } from 'react-router-dom'
const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { setUser } = useContext(UserContext)
  async function handleSubmit(e) {
    e.preventDefault()
    await axios.post('/users/register', {
      email,
      password
    }).then((response) => {
      console.log(response.data)
      localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
      navigate('/')
    }).catch((error) => {
      console.error(error)
    })
  }
  return (
   <>
     <div className="min-h-screen flex items-center justify-center bg-[#323232]">
        <div className="bg-[#414141] shadow-xl rounded-xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Create a new account</h2>
            <form className="space-y-5"
            onSubmit={handleSubmit}
            >
                <div>
                    <label className="block text-gray-300 mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full px-4 py-3 rounded-lg  text-white border border-[#e6e6e6] focus:outline-none  "
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email"
                        autoComplete="email"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="w-full px-4 py-3 rounded-lg text-white border border-[#e6e6e6] focus:outline-none "
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 cursor-pointer text-[17px] tracking-wide hover:bg-[#1f1f1f] rounded-lg bg-black text-white font-semibold transition-colors">
                    Create Account
                </button>
            </form>
            <div className="mt-6 text-center">
                <span className="text-gray-400">Don't have an account? </span>
                <NavLink to={'/login'}
                    className="text-[#e6e6e6] hover:underline font-medium" >
                    Already have an account? 
                </NavLink>
            </div>
        </div>
    </div>

</>
  )
}

export default Register