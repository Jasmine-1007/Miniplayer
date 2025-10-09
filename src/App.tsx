import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './pages/Home'
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1>My App</h1>
      {/* This is where child routes (Home, Callback) will render */}
      <Outlet />
    </div>
  );
}
