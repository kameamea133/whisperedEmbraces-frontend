import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import FormContainer from '@/components/FormContainer';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';
import { useUpdateProfileMutation } from '@/slices/usersApiSlice';
import SoftNotification from '@/components/SoftNotification';
import { Eye, EyeOff } from 'lucide-react';

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [username, setUsername] = useState(userInfo?.username || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const togglePasswordVisibility = (setter) => {
    setter((prev) => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setNotification({ show: true, message: 'Les nouveaux mots de passe ne correspondent pas', type: 'error' });
      return;
    }
    try {
      // eslint-disable-next-line no-unused-vars
      const updatedUser = await updateProfile({ username, email, password, newPassword }).unwrap();
      setNotification({ show: true, message: 'Profil mis à jour avec succès', type: 'success' });
      // console.log('Profil mis à jour :', updatedUser);
    } catch (err) {
      setNotification({ show: true, message: err.data?.message || 'Erreur lors de la mise à jour', type: 'error' });
    }
  };

  return (
    <>
      {notification.show && (
        <SoftNotification 
          message={notification.message} 
          onClose={() => setNotification({ ...notification, show: false })} 
        />
      )}
      <FormContainer>
        <h1 className="text-2xl font-bold mb-6 text-center">Mon Profil</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="my-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Nom d&apos;utilisateur
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-2 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe actuel
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Entrer votre mot de passe actuel"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-8 text-gray-500"
              onClick={() => togglePasswordVisibility(setShowPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div className="my-2 relative">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Entrer un nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-8 text-gray-500"
              onClick={() => togglePasswordVisibility(setShowNewPassword)}
            >
              {showNewPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <div className="my-2 relative">
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmNewPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Confirmer le nouveau mot de passe"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-8 text-gray-500"
              onClick={() => togglePasswordVisibility(setShowConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {isLoading && <Spinner />}

          <Button
            type="submit"
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Mettre à jour
          </Button>
        </form>
      </FormContainer>
    </>
  );
};

export default ProfileScreen;
