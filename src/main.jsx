import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import HomeScreen from './screens/HomeScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import PostsScreen from './screens/PostsScreen'
import ArticleScreen from './screens/ArticleScreen'
import Conditions from './screens/conditionsScreen'
import PrivacyPolicy from './screens/PrivacyPolicy'
import store from './store'
import PrivateRoute from './components/PrivateRoute'
import { Provider } from 'react-redux'

import './index.css'
import App from './App.jsx'


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} >

      <Route index={true} element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/post/:id' element={<ArticleScreen />} />
      <Route path='/conditions' element={<Conditions />} />
      <Route path='/privacy' element={<PrivacyPolicy />} />
    {/* Private Routes */}
      <Route element={<PrivateRoute />}>
      <Route path='/profile' element={<ProfileScreen />} />
      <Route path='/posts' element={<PostsScreen />} />
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
  </Provider>
)
