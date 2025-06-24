import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import store from './store';
import PrivateRoute from './components/PrivateRoute';
import { Provider } from 'react-redux';
import "./lib/i18n"
import './index.css';
import App from './App.jsx';

// Lazy loading des composants
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const PostsScreen = lazy(() => import('./screens/PostsScreen'));
const ArticleScreen = lazy(() => import('./screens/ArticleScreen'));
const Conditions = lazy(() => import('./screens/conditionsScreen'));
const ContactScreen = lazy(() => import('./screens/ContactScreen'));
const PrivacyPolicy = lazy(() => import('./screens/PrivacyPolicy'));

// Composant de chargement
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#34B0CA]"></div>
  </div>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={
        <Suspense fallback={<LoadingSpinner />}>
          <HomeScreen />
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<LoadingSpinner />}>
          <LoginScreen />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<LoadingSpinner />}>
          <RegisterScreen />
        </Suspense>
      } />
      <Route path="/post/:id" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ArticleScreen />
        </Suspense>
      } />
      <Route path="/conditions" element={
        <Suspense fallback={<LoadingSpinner />}>
          <Conditions />
        </Suspense>
      } />
      <Route path="/privacy" element={
        <Suspense fallback={<LoadingSpinner />}>
          <PrivacyPolicy />
        </Suspense>
      } />
      <Route path="/contact" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ContactScreen />
        </Suspense>
      } />
      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={
          <Suspense fallback={<LoadingSpinner />}>
            <ProfileScreen />
          </Suspense>
        } />
        <Route path="/posts" element={
          <Suspense fallback={<LoadingSpinner />}>
            <PostsScreen />
          </Suspense>
        } />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);
