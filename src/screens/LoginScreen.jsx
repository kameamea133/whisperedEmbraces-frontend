import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormContainer from "@/components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/slices/authSlice";
import { Button } from "@/components/ui/button";
import SoftNotification from "@/components/SoftNotification";
import Spinner from "@/components/Spinner";
import { auth, db } from "@/firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");
  const [resetError, setResetError] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { t } = useTranslation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const closeNotification = () => {
    setError(null);
    setResetError(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        dispatch(
          setCredentials({
            email: user.email,
            uid: user.uid,
            username: userData.username,
          })
        );

        navigate("/");
      } else {
        throw new Error(t('login.userNotFound'));
      }
    } catch (err) {
      setError(t('login.missingFields'));
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
  
    try {
      await sendPasswordResetEmail(auth, emailForReset);
      setResetError(null);
      alert(t('login.resetSuccess'));
      setShowResetForm(false); 
    } catch (error) {
      setResetError(t('login.resetError'));
      console.error(error.message);
    } finally {
      setResetLoading(false);
    }
  };
  

 

  return (
    <FormContainer>
    <h1 className="text-2xl font-bold mb-6 text-center">
      {showResetForm ? t('login.resetTitle') : t('login.title')}
    </h1>

    {!showResetForm ? (
      <form onSubmit={submitHandler} className="space-y-4">
        <div className="my-2 flex flex-col">
          <label>{t('login.email')}</label>
          <input
            type="email"
            placeholder={t('login.enterEmail')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        <div className="my-2 flex flex-col">
          <label>{t('login.password')}</label>
          <input
            type="password"
            placeholder={t('login.enterPassword')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
            required
          />
        </div>
        {loading && <Spinner />}
        <Button type="submit" className="w-full">{t('login.submit')}</Button>
      </form>
    ) : (
      <form onSubmit={handleResetPassword} className="flex flex-col space-y-4">
        <label>{t('login.resetInstructions')}</label>
        <input
          type="email"
          value={emailForReset}
          onChange={(e) => setEmailForReset(e.target.value)}
          className="border p-2"
          required
        />
        {resetLoading && <Spinner />}
        {resetError && <p className="text-red-600">{resetError}</p>}
        <Button type="submit" className="w-full">{t('login.resetSubmit')}</Button>
      </form>
    )}

    <div className="py-3 text-center">
      {!showResetForm ? (
        <>
          <p>{t('login.register')} <Link to="/register" className="text-blue-500">{t('login.signUp')}</Link></p>
          <p><Link to="#" onClick={() => setShowResetForm(true)} className="text-blue-500">{t('login.forgotPassword')}</Link></p>
        </>
      ) : (
        <button onClick={() => setShowResetForm(false)} className="text-blue-500">{t('login.backToLogin')}</button>
      )}
    </div>

    {error && <SoftNotification message={error} onClose={closeNotification} />}
    {resetError && <SoftNotification message={resetError} onClose={closeNotification} />}
  </FormContainer>
  );
};

export default LoginScreen;
