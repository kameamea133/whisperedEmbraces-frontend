import { useEffect } from 'react';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

const useAuthTokenExpiration = () => {
  const auth = getAuth();

  useEffect(() => {
    const checkTokenExpiration = async (user) => {
      if (user) {
        const currentTime = Date.now() / 1000; // En secondes
        const tokenExpirationTime = user.stsTokenManager.expirationTime / 1000;

        if (currentTime > tokenExpirationTime) {
          await signOut(auth);
          console.log('User has been logged out due to token expiration');
          alert('You have been logged out due to inactivity.');
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkTokenExpiration(user);
      }
    });

    return () => unsubscribe();
  }, [auth]);
};

export default useAuthTokenExpiration;
