import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormContainer from '@/components/FormContainer';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';
import { setCredentials } from '@/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import SoftNotification from '@/components/SoftNotification';
import { auth } from '@/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";


const RegisterScreen = () => {

 
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
   

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);


    const submitHandler = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        SoftNotification('error', 'Le mot de passe ne correspond pas');
      } else {
        try {
          setLoading(true);
         
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          
          
          const user = userCredential.user;
          dispatch(setCredentials({
            username: username,
            email: user.email,
            uid: user.uid, 
          }));
  
          SoftNotification('success', 'Inscription réussie. Veuillez vous connecter.');
          navigate('/login');
        } catch (err) {
          SoftNotification('error', err.message);
        } finally {
          setLoading(false);
        }
      }
    };

  return (
    <>
    
    <FormContainer>
    <h1 className="text-2xl font-bold mb-6 text-center">S&#39;enregistrer</h1>

    <form onSubmit={submitHandler} className="space-y-4">
    <div className="my-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Nom d&apos;utilisateur
          </label>
          <input
            type="text"
            id="username"
           
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="John"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="my-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
           
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Entrer votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="my-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Entrer votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="my-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
           Confirmer mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Confirmer votre mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {loading && <Spinner />}
       
        <Button
          
          type="submit"
          className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          S&apos;inscrire
        </Button>
      </form>

      <div className="py-3 text-center">
        <p>
          Vous avez deja un compte?<Link to="/login" className="text-blue-500 hover:underline"> Se connecter</Link>
        </p>
      </div>
    </FormContainer>
    </>
  )
}

export default RegisterScreen