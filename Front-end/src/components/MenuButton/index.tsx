import type { IconType } from 'react-icons';

interface MenuButtonProps {
  icon: IconType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const MenuButton = ({ icon: Icon, label, isActive = false, onClick }: MenuButtonProps) => {
  return (
    <button 
      className={`flex items-center ${isActive ? 'bg-yellow-600 text-black' : 'bg-yellow-500 opacity-75 hover:bg-yellow-600 text-black'} py-3 px-4 rounded-lg w-full transition-colors`}
      onClick={onClick}
    >
      <Icon className="mr-3" size={18} />
      <span>{label}</span>
    </button>
  );
};

export default MenuButton;
