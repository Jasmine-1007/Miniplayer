import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, createBrowserRouter, RouterProvider} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import './index.css'
import App from './App'
import Home from './pages/Home'
import Mainpage from "./functions/Mainpage"
import HandleCallback from "./functions/handleCallback"


const queryClient = new QueryClient();

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
        path: '/main',
        element: <Mainpage />,
      },  
      {
        path: '/handlecallback',
        element: <HandleCallback />,
      },  
    ]
  }
])

const rootEle = document.getElementById('root');
if(rootEle){
  createRoot(rootEle).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}>
      
      </RouterProvider>
      
    </QueryClientProvider>
  
  </StrictMode>,
)
}

