import React, { useState, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { UserContext } from '../context/User.contenxt'
import axios from '../config/Axios'
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) // 👈 toggle state
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
      <div className="min-h-screen flex items-center justify-center bg-[#202020]">
        <div className="bg-[#2d2d2d] shadow-xl rounded-xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Create a new account</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Email */}
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="email">
                Email
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg text-white border border-[#e6e6e6] focus:outline-none"
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg text-white border border-[#e6e6e6] focus:outline-none pr-10"
                  type={showPassword ? "text" : "password"} // 👈 toggle here
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                {/* Eye icon button */}
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <VscEyeClosed size={20} /> : <VscEye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 cursor-pointer text-[17px] tracking-wide hover:bg-[#1f1f1f] rounded-lg bg-black text-white font-semibold transition-colors">
              Create Account
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <span className="text-gray-400">Already have an account? </span>
            <NavLink
              to={'/login'}
              className="text-[#e6e6e6] hover:underline font-medium"
            >
              Sign in
            </NavLink>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
