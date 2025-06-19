import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, addDoc } from 'firebase/firestore';
import SideMenu from '../../components/SideMenu';
import { FaBox, FaArrowCircleDown, FaArrowCircleUp, FaUsers, FaBars } from 'react-icons/fa';
import type { IconType } from 'react-icons';
import useAuth from '../../hooks/useAuth';

interface MenuItem {
  id: string;
  icon: IconType;
  label: string;
  adminOnly?: boolean;
}

interface Product {
  id: string;
  name: string;
  quantity: number;
}

const RegisterEntry = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('entry');
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [currentStock, setCurrentStock] = useState<number | null>(null);
  const { currentUser } = useAuth();
  const menuItems: MenuItem[] = [
    { id: 'products', icon: FaBox, label: 'Cadastrar Produto' },
    { id: 'entry', icon: FaArrowCircleDown, label: 'Registrar Entrada' },
    { id: 'exit', icon: FaArrowCircleUp, label: 'Registrar Saída' },
    { id: 'users', icon: FaUsers, label: 'Gerenciar Usuários', adminOnly: true },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsList: Product[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        quantity: doc.data().quantity || 0
      }));
      setProducts(productsList);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchStock = async () => {
      if (!selectedProductId) {
        setCurrentStock(null);
        return;
      }
      const db = getFirestore();
      const productRef = doc(db, 'products', selectedProductId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setCurrentStock(productSnap.data().quantity || 0);
      } else {
        setCurrentStock(null);
      }
    };
    fetchStock();
  }, [selectedProductId]);

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
      if (!selectedProductId || !quantity) {
        setError('Selecione um produto e informe a quantidade.');
        setLoading(false);
        return;
      }
      const db = getFirestore();
      const productRef = doc(db, 'products', selectedProductId);
      const productSnap = await getDoc(productRef);
      if (!productSnap.exists()) {
        setError('Produto não encontrado.');
        setLoading(false);
        return;
      }
      const oldQuantity = productSnap.data().quantity || 0;
      const newQuantity = oldQuantity + Number(quantity);
      await updateDoc(productRef, { quantity: newQuantity });
      // Adiciona log de entrada
      await addDoc(collection(db, 'logs'), {
        userId: currentUser?.uid,
        type: 'entrada',
        productName: productSnap.data().name,
        quantity: Number(quantity),
        date: new Date().toISOString(),
      });
      setSuccess('Entrada registrada com sucesso!');
      setCurrentStock(newQuantity);
      setQuantity('');
    } catch {
      setError('Erro ao registrar entrada. Tente novamente.');
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
      <div className="flex-1 overflow-auto">
        <div className="bg-yellow-400 p-4 md:hidden">
          <button onClick={toggleMenu} className="text-white">
            <FaBars size={24} />
          </button>
        </div>
        <div className="p-6 md:p-10">
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-2xl font-semibold text-center text-black mb-6">Registrar Entrada de Produto</h1>
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">{success}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}
            <div className="bg-gray-100 rounded-lg p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">Produto:</label>
                  <select
                    id="product"
                    className="block w-full border border-gray-300 rounded-md p-2"
                    value={selectedProductId}
                    onChange={e => setSelectedProductId(e.target.value)}
                    required
                  >
                    <option value="">Selecione um produto</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantidade de entrada:</label>
                    <input
                      type="number"
                      id="quantity"
                      placeholder="Quantidade"
                      className="block w-full border border-gray-300 rounded-md p-2"
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      min={1}
                      required
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estoque atual:</label>
                    <div className="bg-white border border-gray-300 rounded-md p-2 text-center">
                      {currentStock !== null ? currentStock : '--'}
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Registrando...' : 'Registrar entrada'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEntry;
