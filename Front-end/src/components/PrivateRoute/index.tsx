import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();
    if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
