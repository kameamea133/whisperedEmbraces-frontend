import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormContainer from '@/components/FormContainer';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';
import SoftNotification from '@/components/SoftNotification';
import { auth, db } from '@/firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useTranslation } from 'react-i18next';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { t } = useTranslation();

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            SoftNotification('error', 'Le mot de passe ne correspond pas');
            return;
        }

        setLoading(true);

        try {
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: user.email,
            });

           
            navigate('/login'); 
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
                <h1 className="text-2xl font-bold mb-6 text-center">{t('register.title')}</h1>

                <form onSubmit={submitHandler} className="space-y-4">
                    <div className="my-2">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            {t('register.username')}
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
                            {t('register.email')}
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder={t('register.enterEmail')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="my-2">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            {t('register.password')}
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder={t('register.enterPassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="my-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                            {t('register.confirmPassword')}
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder={t('register.confirmYourPassword')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {loading && <Spinner />}

                    <Button type="submit" className="mt-3 w-full bg-gray-900 text-white text-md py-2 px-4 rounded-md hover:bg-gray-900/80 transition duration-1000">
                        {t('register.submit')}
                    </Button>
                </form>

                <div className="py-3 text-center">
                    <p>{t('register.alreadyHaveAccount')} <Link to="/login" className="text-[#34B0CA] hover:underline">{t('register.login')}</Link></p>
                </div>

                {error && <SoftNotification message={error} onClose={closeNotification} />}
            </FormContainer>
        </>
    );
}

export default RegisterScreen;
