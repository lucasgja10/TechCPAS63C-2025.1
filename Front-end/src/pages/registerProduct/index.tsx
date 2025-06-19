import { useState } from 'react';
import { FaBox, FaArrowCircleDown, FaArrowCircleUp, FaUsers, FaBars } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import SideMenu from '../../components/SideMenu';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import useAuth from '../../hooks/useAuth';

interface MenuItem {
  id: string;
  icon: IconType;
  label: string;
  adminOnly?: boolean;
}

const RegisterProduct = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('products');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  useAuth();
  
  const menuItems: MenuItem[] = [
    { id: 'products', icon: FaBox, label: 'Cadastrar Produto' },
    { id: 'entry', icon: FaArrowCircleDown, label: 'Registrar Entrada' },
    { id: 'exit', icon: FaArrowCircleUp, label: 'Registrar Saída' },
    { id: 'users', icon: FaUsers, label: 'Gerenciar Usuários', adminOnly: true },
  ];
  
  const handleMenuItemClick = (id: string) => {
    setActiveMenuItem(id);
    if (window.innerWidth < 768) {
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const db = getFirestore();
      await addDoc(collection(db, 'products'), {
        name,
        code,
        quantity: Number(quantity),
        price: Number(price),
        createdAt: new Date()
      });
      setSuccess('Produto cadastrado com sucesso!');
      setName('');
      setCode('');
      setQuantity('');
      setPrice('');
    } catch {
      setError('Erro ao cadastrar produto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideMenu 
        menuItems={menuItems}
        activeMenuItem={activeMenuItem}
        onMenuItemClick={handleMenuItemClick}
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 overflow-auto">
        {/* Botão Hamburguer Mobile */}
        <div className="bg-yellow-400 p-4 md:hidden">
          <button onClick={toggleMenu} className="text-white">
            <FaBars size={24} />
          </button>
        </div>

        {/* Conteúdo do Formulário */}
        <div className="p-6 md:p-10">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-center text-black mb-6">Cadastro de Produto</h1>
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">{success}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}
            <div className="bg-gray-100 rounded-lg p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome do produto:</label>
                  <input 
                    type="text" 
                    id="name" 
                    placeholder="Nome:" 
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Código:</label>
                  <input 
                    type="text" 
                    id="code" 
                    placeholder="Código:" 
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantidade:</label>
                  <input 
                    type="number" 
                    id="quantity" 
                    placeholder="Quantidade:" 
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Preço:</label>
                  <input 
                    type="number" 
                    id="price" 
                    placeholder="Preço:" 
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterProduct;