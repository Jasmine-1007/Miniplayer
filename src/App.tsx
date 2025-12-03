import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className='bg-black flex flex-col h-screen min-h-0'>
      {/* This is where child routes (Home, Callback) will render */}
      <Outlet />
    </div>
  );
}
