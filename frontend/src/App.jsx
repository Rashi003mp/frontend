import React from 'react';
import Registration from './pages/Registration';
import Login from './pages/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/landingpage/Landing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/registration' element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
