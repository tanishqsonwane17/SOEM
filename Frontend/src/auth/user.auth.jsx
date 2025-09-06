import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/User.contenxt';
import { Navigate } from 'react-router-dom';
import axios from '../config/Axios';

const UserAuth = ({ children }) => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchProfile = async () => {
      if (token && !user) {
        try {
          const response = await axios.get('/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(response.data.user); 
        } catch (err) {
          console.error("Error fetching profile:", err);
          localStorage.removeItem("token"); 
        }
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token, user, setUser]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    console.log('No token or user found, redirecting to login...');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default UserAuth;
