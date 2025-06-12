import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import SideMenu from '../../components/SideMenu';
import { FaBox, FaArrowCircleDown, FaArrowCircleUp, FaUsers, FaBars } from 'react-icons/fa';
import type { IconType } from 'react-icons';

interface MenuItem {
  id: string;
  icon: IconType;
  label: string;
  adminOnly?: boolean;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  permission: 'administrador' | 'operador';
}

interface LogData {
  id: string;
  userId: string;
  type: 'entrada' | 'saida';
  productName: string;
  quantity: number;
  date: string;
}

const ManageUsers = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const menuItems: MenuItem[] = [
    { id: 'products', icon: FaBox, label: 'Cadastrar Produto' },
    { id: 'entry', icon: FaArrowCircleDown, label: 'Registrar Entrada' },
    { id: 'exit', icon: FaArrowCircleUp, label: 'Registrar Saída' },
    { id: 'users', icon: FaUsers, label: 'Gerenciar Usuários', adminOnly: true },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList: UserData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        permission: doc.data().permission || 'operador',
      }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleMenuItemClick = (id: string) => {
    setActiveMenuItem(id);
    if (window.innerWidth < 768) {
      setMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePermissionChange = async (userId: string, newPermission: 'administrador' | 'operador') => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const db = getFirestore();
      await updateDoc(doc(db, 'users', userId), { permission: newPermission });
      setUsers(users => users.map(u => u.id === userId ? { ...u, permission: newPermission } : u));
      
      // Armazena a permissão no localStorage para acesso rápido
      localStorage.setItem(`user_permission_${userId}`, newPermission);
      
      setSuccess('Permissão atualizada com sucesso!');
    } catch {
      setError('Erro ao atualizar permissão.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowStatus = async (user: UserData) => {
    setSelectedUser(user);
    setLogs([]);
    setLoading(true);
    setError('');
    try {
      const db = getFirestore();
      // Supondo que você tenha uma coleção 'logs' com userId, type, productName, quantity, date
      const q = query(collection(db, 'logs'), where('userId', '==', user.id), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const logsList: LogData[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        userId: doc.data().userId,
        type: doc.data().type,
        productName: doc.data().productName,
        quantity: doc.data().quantity,
        date: doc.data().date,
      }));
      setLogs(logsList);
    } catch (err) {
      setError('Erro ao buscar status do usuário: ' + (err as Error).message);
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
            <h1 className="text-2xl font-semibold text-center text-black mb-6">Gerenciar Usuários</h1>
            {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-center">{success}</div>}
            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-100 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">Nome</th>
                    <th className="py-2 px-4 text-left">E-mail</th>
                    <th className="py-2 px-4 text-left">Permissão</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">
                        <select
                          value={user.permission}
                          onChange={e => handlePermissionChange(user.id, e.target.value as 'administrador' | 'operador')}
                          className="border rounded p-1"
                          disabled={loading}
                        >
                          <option value="administrador">Administrador</option>
                          <option value="operador">Operador</option>
                        </select>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                          onClick={() => handleShowStatus(user)}
                          disabled={loading}
                        >
                          Ver status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {selectedUser && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Status de {selectedUser.name}</h2>
                {logs.length === 0 ? (
                  <p className="text-gray-600">Nenhuma movimentação encontrada.</p>
                ) : (
                  <table className="min-w-full bg-gray-50 rounded-lg">
                    <thead>
                      <tr>
                        <th className="py-2 px-4 text-left">Tipo</th>
                        <th className="py-2 px-4 text-left">Produto</th>
                        <th className="py-2 px-4 text-left">Quantidade</th>
                        <th className="py-2 px-4 text-left">Data</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(log => (
                        <tr key={log.id} className="border-b">
                          <td className="py-2 px-4">{log.type === 'entrada' ? 'Entrada' : 'Saída'}</td>
                          <td className="py-2 px-4">{log.productName}</td>
                          <td className="py-2 px-4">{log.quantity}</td>
                          <td className="py-2 px-4">{new Date(log.date).toLocaleString('pt-BR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
