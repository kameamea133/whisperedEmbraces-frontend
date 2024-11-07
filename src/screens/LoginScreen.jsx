import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormContainer from '@/components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/slices/authSlice';
import { Button } from '@/components/ui/button';
import SoftNotification from '@/components/SoftNotification';
import Spinner from '@/components/Spinner';
import { auth, db } from "@/firebaseConfig"; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
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
      setLoading(true);

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        
        const userDocRef = doc(db, "users", user.uid); 
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();

          
          dispatch(setCredentials({
            email: user.email,
            uid: user.uid,
            username: userData.username, 
          }));
          
          navigate('/');
        } else {
          throw new Error("Les informations de l'utilisateur sont introuvables.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const closeNotification = () => {
      setError(null);
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
              placeholder="Entrer l'email"
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
          {loading && <Spinner />}
          <Button
            type="submit"
            className="mt-3 w-full bg-[#34B0CA] text-white text-md py-2 px-4 rounded-md hover:bg-[#34B0CA]/70 disabled:opacity-50 hover:text-gray-600"
          >
            Se connecter
          </Button>
        </form>

        <div className="py-3 text-center">
          <p>
            Vous êtes nouveau ici ? <Link to="/register" className="text-[#34B0CA] hover:underline">S&rsquo;inscrire</Link>
          </p>
        </div>

        {error && (
          <SoftNotification message={error} onClose={closeNotification} />
        )}
      </FormContainer>
    </>
  );
};

export default LoginScreen;
