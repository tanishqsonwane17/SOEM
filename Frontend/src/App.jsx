import React from 'react'
import AppRoutes from './Routes/AppRoutes'
import { UserProvider } from './context/User.contenxt'
const App = () => {
  return (
    <div>
      <UserProvider>
         <AppRoutes />
      </UserProvider>
    </div>
  )
}

export default App