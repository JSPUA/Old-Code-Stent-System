import React,{useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const ProtectedRoute = ({ children }) => {
  const { icNo, activeTab } = useSelector(state => state.user);
const navigate = useNavigate();
  // Check if the user is authenticated
  const isAuthenticated = icNo && activeTab;

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    // Render nothing or a loading component until the redirect takes effect
    return null;
  }

  return children;

};

export default ProtectedRoute;