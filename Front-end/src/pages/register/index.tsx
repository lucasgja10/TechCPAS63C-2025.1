import { CiUser } from "react-icons/ci";
import { CiLock } from "react-icons/ci";
import { AiOutlineMail } from "react-icons/ai";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await signup(email, password);
      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        name,
        email
      });
      navigate("/register-product");
    } catch {
      setError("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-400">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-black mb-6">Cadastro</h1>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative flex items-center">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <CiUser className="text-gray-400" size={20} />
            </div>
            <input
              type="text"
              id="name"
              placeholder="Usuário"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative flex items-center">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <AiOutlineMail className="text-gray-400" size={20} />
            </div>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 relative flex items-center">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <CiLock className="text-gray-400" size={20} />
            </div>
            <input
              type="password"
              id="password"
              placeholder="Senha"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 pl-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-md font-semibold transition-colors"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>
        </form>
        <div className="text-center mt-4">
          <p className="text-black">
            Já tem uma conta? <Link to="/login" className="text-yellow-500 hover:text-yellow-600 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;