import React, {useState, useContext} from 'react'
import { UserContext } from '../context/User.contenxt'
import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import axios from '../config/Axios'
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useContext(UserContext)
   const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('/users/login', {
      email,
      password
    }).then((response) => {
        console.log(response.data)
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
        navigate('/')
    }).catch((error) => {
        console.error(error.response.data)
    })
  }

  return (
   <>
       <div className="min-h-screen flex items-center justify-center bg-[#323232]">
        <div className="bg-[#414141] shadow-xl rounded-xl p-8 w-full max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Sign in to your account</h2>
            <form className="space-y-5"
            onSubmit={handleSubmit}
            >
                <div>
                    <label className="block text-gray-300 mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="w-full px-4 py-2 rounded-lg text-white border border-[#e6e6e6a8] focus:outline-none"
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-300 mb-1" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="w-full px-4 py-2 rounded-lg text-white border border-[#e6e6e6a8] focus:outline-none"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-black cursor-pointer text-white font-semibold transition-colors"
                >
                    Sign In
                </button>
            </form>
            <div className="mt-6 text-center">
                <span className="text-gray-300">Don't have an account? </span>
                <NavLink to={'/register'}
                    className="text-white hover:underline font-medium">
                    Create a new account
                </NavLink>
            </div>
        </div>
    </div>

   </>
  )
}

export default Login