import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormContainer from '@/components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '@/slices/usersApiSlice';
import { setCredentials } from '@/slices/authSlice';
import { Button } from '@/components/ui/button';
import SoftNotification from '@/components/SoftNotification';
import Spinner from '@/components/Spinner';


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
      if (userInfo) {
        navigate('/');
      }
    }, [navigate, userInfo]);


    const submitHandler = async (e) => {
        e.preventDefault();

        try {
          const res = await login({ email, password }).unwrap();
          dispatch(setCredentials({ ...res }));
          navigate('/');
        } catch (err) {
          setError(err.data.message || err.error);
        }
    }

    const closeNotification = () => {
      setError(null); // Réinitialise l'erreur pour cacher la notification
    };

  return (
    <>
    
    <FormContainer>
    <h1 className="text-2xl font-bold mb-6 text-center">Connexion</h1>

    <form onSubmit={submitHandler} className="space-y-4">
        <div className="my-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
           
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Entrer l&apos;email"
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
            placeholder="Entrer le mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
       
          {isLoading && <Spinner />}

        <Button
          
          type="submit"
          className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Se connecter
        </Button>
      </form>

      <div className="py-3 text-center">
        <p>
          Vous êtes nouveau ici?<Link to="/register" className="text-blue-500 hover:underline"> S&apos;inscrire</Link>
        </p>
      </div>

      {error && (
        <SoftNotification message={error} onClose={closeNotification} />
      )}
    </FormContainer>
    </>
  )
}

export default LoginScreen