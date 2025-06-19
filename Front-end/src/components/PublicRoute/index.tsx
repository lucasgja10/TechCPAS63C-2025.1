import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const PublicRoute = () => {
  const { currentUser, loading } = useAuth();
    if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  return currentUser ? <Navigate to="/register-product" /> : <Outlet />;
};

export default PublicRoute;
