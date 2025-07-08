import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Spinner from './components/Spinner';
import store from './store';
import PrivateRoute from './components/PrivateRoute';
import { Provider } from 'react-redux';
import "./lib/i18n"
import './index.css';
import App from './App.jsx';

const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const LoginScreen = lazy(() => import('./screens/LoginScreen'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen'));
const PostsScreen = lazy(() => import('./screens/PostsScreen'));
const ArticleScreen = lazy(() => import('./screens/ArticleScreen'));
const Conditions = lazy(() => import('./screens/conditionsScreen'));
const ContactScreen = lazy(() => import('./screens/ContactScreen'));
const PrivacyPolicy = lazy(() => import('./screens/PrivacyPolicy'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomeScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/post/:id" element={<ArticleScreen />} />
      <Route path="/conditions" element={<Conditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/contact" element={<ContactScreen />} />
      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/posts" element={<PostsScreen />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <Suspense fallback={<Spinner />}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>
  </Provider>
);
