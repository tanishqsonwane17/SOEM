import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/User.contenxt';
import { Navigate } from 'react-router-dom';

const UserAuth = ({ children }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // You can add any async auth logic here if needed
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default UserAuth;

