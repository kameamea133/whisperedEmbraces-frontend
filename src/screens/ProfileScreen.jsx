import { useState } from 'react';
import { useSelector } from 'react-redux';
import FormContainer from '@/components/FormContainer';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/Spinner';
import { useTranslation } from 'react-i18next';
import SoftNotification from '@/components/SoftNotification';
import { Eye, EyeOff } from 'lucide-react';
import { db, auth } from '@/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import {  updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

const ProfileScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [username, setUsername] = useState(userInfo?.username || '');

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);

  const currentUser = auth.currentUser;

  const { t } = useTranslation();

  const togglePasswordVisibility = (setter) => {
    setter((prev) => !prev);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      if (password) {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
      }

      
     

     
      if (newPassword && newPassword === confirmNewPassword) {
        await updatePassword(currentUser, newPassword);
      } else if (newPassword !== confirmNewPassword) {
        setNotification({ show: true, message: t('profile.passwordsDoNotMatch'), type: 'error' });
        setLoading(false);
        return;
      }

      
      if (username !== userInfo?.username) {
        const userDocRef = doc(db, "users", currentUser.uid); 
        await updateDoc(userDocRef, { username });
      }

      setNotification({ show: true, message: t('profile.profileUpdated'), type: 'success' });
    } catch (err) {
      setNotification({ show: true, message: err.message || t('profile.updateError'), type: 'error' });
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold mb-6 text-center">{t('profile.title')}</h1>
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="my-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            {t('profile.username')}
            </label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="my-2 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            {t('profile.currentPassword')}
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={t('profile.enterCurrentPassword')}
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
            {t('profile.newPassword')}
            </label>
            <input
              type={showNewPassword ? 'text' : 'password'}
              id="newPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={t('profile.enterNewPassword')}
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
            {t('profile.confirmNewPassword')}
            </label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmNewPassword"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder={t('profile.confirmNewPasswordPlaceholder')}
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

          {loading && <Spinner />}

          <Button
            type="submit"
            className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {t('profile.save')}
          </Button>
        </form>
      </FormContainer>
    </>
  );
};

export default ProfileScreen;
