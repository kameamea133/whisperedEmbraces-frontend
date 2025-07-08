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
import emailjs from 'emailjs-com';
// NOUVEAU : Importer les icônes pour la popup
import { CheckCircle, Mail, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // NOUVEAU : État pour la popup de confirmation
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [countdown, setCountdown] = useState(3);

    const navigate = useNavigate();
    const { t } = useTranslation();

    // NOUVEAU : Effet pour le countdown de redirection
    useEffect(() => {
        let timer;
        if (showSuccessPopup && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (showSuccessPopup && countdown === 0) {
            navigate('/login');
        }
        return () => clearTimeout(timer);
    }, [showSuccessPopup, countdown, navigate]);

    // FONCTION 1 : Notification admin
    const sendAdminNotification = async (userData) => {
        try {
            const templateParams = {
                to_email: 'monnier1977@gmail.com',
                email_subject: `🔔 Nouvel utilisateur inscrit - ${userData.username}`,
                email_content: `Bonjour,

Un nouvel utilisateur vient de s'inscrire sur Étreintes Éphémères !

📝 Détails de l'inscription :
- Nom d'utilisateur : ${userData.username}
- Email : ${userData.email}
- Date d'inscription : ${userData.registration_date}

Vous pouvez maintenant voir cette personne dans votre base d'utilisateurs.

---
Notification automatique d'Étreintes Éphémères`,
                username: userData.username,
                user_email: userData.email,
                registration_date: userData.registration_date
            };

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,        
                import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,  
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            console.log('✅ Notification admin envoyée');
        } catch (error) {
            console.error('❌ Erreur notification admin:', error);
        }
    };

    // FONCTION 2 : Email de bienvenue utilisateur
    const sendWelcomeEmail = async (userData) => {
        try {
            const templateParams = {
                to_email: userData.email,
                email_subject: `🎉 Bienvenue sur Étreintes Éphémères, ${userData.username} !`,
                email_content: `Bonjour ${userData.username},

Bienvenue dans notre communauté de poésie et d'écriture créative ! 🌟

Votre compte a été créé avec succès le ${userData.registration_date}. Vous pouvez maintenant :

✨ Créer et partager vos textes poétiques
💫 Découvrir les créations de notre communauté  
🔊 Transformez votre texte en audio sur simple demande

🚀 Commencez votre voyage littéraire en vous connectant :
https://etreintes-ephemeres.com/login

Merci de rejoindre notre univers d'étreintes éphémères.

L'équipe d'Étreintes Éphémères 💙`,
                username: userData.username,
                user_email: userData.email,
                registration_date: userData.registration_date
            };

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,        
                import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,  // Même template !
                templateParams,
                import.meta.env.VITE_EMAILJS_PUBLIC_KEY
            );

            console.log('✅ Email de bienvenue envoyé');
        } catch (error) {
            console.error('❌ Erreur email bienvenue:', error);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            SoftNotification('error', 'Le mot de passe ne correspond pas');
            return;
        }

        setLoading(true);

        try {
            // 1. Créer le compte Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Préparer les données utilisateur avec la date formatée
            const userData = {
                username: username,
                email: user.email,
                createdAt: new Date(),
                uid: user.uid,
                registration_date: new Date().toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })
            };

            // 3. Sauvegarder dans Firestore
            await setDoc(doc(db, "users", user.uid), userData);

            // 4. Envoyer les DEUX emails
            await sendAdminNotification(userData);
            await sendWelcomeEmail(userData);

            // 5. NOUVEAU : Afficher la popup de confirmation
            setShowSuccessPopup(true);
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // NOUVEAU : Fonction pour rediriger immédiatement
    const handleImmediateRedirect = () => {
        navigate('/login');
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

            {/* NOUVELLE POPUP DE CONFIRMATION */}
            {showSuccessPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full mx-auto shadow-2xl">
                        <div className="text-center">
                            {/* Icône de succès */}
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            
                            {/* Titre */}
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                🎉 Compte créé avec succès !
                            </h3>
                            
                            {/* Message de confirmation */}
                            <p className="text-gray-600 mb-4">
                                Bonjour <strong>{username}</strong> ! Votre compte a été créé.
                            </p>
                            
                            {/* Statut des emails */}
                            <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                <div className="flex items-center text-blue-700 text-sm">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span>Un email de bienvenue vous a été envoyé</span>
                                </div>
                            </div>
                            
                            {/* Countdown et boutons */}
                            <p className="text-sm text-gray-500 mb-4">
                                Redirection automatique dans <span className="font-bold text-[#34B0CA]">{countdown}</span> seconde{countdown !== 1 ? 's' : ''}
                            </p>
                            
                            {/* Bouton de redirection immédiate */}
                            <Button 
                                onClick={handleImmediateRedirect}
                                className="w-full bg-[#34B0CA] hover:bg-[#34B0CA]/80 text-white flex items-center justify-center"
                            >
                                Se connecter maintenant
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default RegisterScreen;
