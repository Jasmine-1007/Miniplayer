import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

import './index.css'
import App from './App'
import Home from './pages/Home'

import Callback from './functions/Callback'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/callback',
        element: <Callback />,
      }, 
    ]
  }
])

const rootEle = document.getElementById('root');
if(rootEle){
  createRoot(rootEle).render(
  <StrictMode>
   <RouterProvider router={router} />
  </StrictMode>,
)
}

