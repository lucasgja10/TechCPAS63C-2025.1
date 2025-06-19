import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const AdminRoute = () => {
  const { currentUser, loading } = useAuth();
    if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }
  
  const isAdmin = currentUser?.uid && localStorage.getItem(`user_permission_${currentUser.uid}`) === 'administrador';
  
  return isAdmin ? <Outlet /> : <Navigate to="/register-product" />;
};

export default AdminRoute;
