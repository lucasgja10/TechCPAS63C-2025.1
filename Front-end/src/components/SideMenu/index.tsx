import { FaSignOutAlt, FaTimes } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import MenuButton from '../MenuButton';
import logo from '../../assets/logo.jpeg';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
  id: string;
  icon: IconType;
  label: string;
  adminOnly?: boolean;
}

interface SideMenuProps {
  menuItems: MenuItem[];
  activeMenuItem: string;
  onMenuItemClick: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({
  menuItems,
  activeMenuItem,
  onMenuItemClick,
  isOpen,
  onClose
}: SideMenuProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
    const isAdmin = currentUser?.uid && localStorage.getItem(`user_permission_${currentUser.uid}`) === 'administrador';
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}      <div 
        className={`bg-yellow-400 h-full fixed md:static w-64 transform transition-transform duration-300 z-30 
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="p-6 flex flex-col h-full">          <div className="flex justify-end md:hidden mb-2">
            <button 
              onClick={onClose}
              className="text-black hover:text-white p-1 rounded-full hover:bg-yellow-600 transition-colors"
              aria-label="Fechar menu"
            >
              <FaTimes size={24} />
            </button>
          </div>
            <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center">
              <img src={logo} alt="Logo" />
            </div>
          </div>

          <nav className="flex-grow flex flex-col">
            <ul className="space-y-3 flex-grow">
              {menuItems.filter(item => !item.adminOnly || isAdmin).map((item) => (
                <li key={item.id}>
                  <MenuButton
                    icon={item.icon}
                    label={item.label}
                    isActive={activeMenuItem === item.id}
                    onClick={() => {
                      
                      onMenuItemClick(item.id);
                      if (item.id === 'entry') {
                        navigate('/register-entry');
                      }
                      if (item.id === 'products') {
                        navigate('/register-product');
                      }
                      if (item.id === 'exit') {
                        navigate('/register-exit');
                      }
                      if (item.id === 'users') {
                        navigate('/manage-users');
                      }
                    }}
                  />
                </li>
              ))}
            </ul>
              <div className="mt-auto pt-6">
              <button 
                className="flex items-center bg-yellow-500 opacity-75 hover:bg-yellow-600 text-black py-3 px-4 rounded-lg w-full transition-colors"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="mr-3" size={18} />
                <span className="font-medium">Sair</span>
              </button>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
