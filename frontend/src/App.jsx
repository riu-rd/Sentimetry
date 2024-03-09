import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.js';
// Components
import ProtectedRoute from './components/ProtectedRoute';
// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Landing from './pages/Landing.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        // @ts-ignore
        setUser(authUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <main>
      { loading ?
        (<h2>Loading. . .</h2>)
        :
        (<BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing user={user}/>}/>
          <Route path='/login' element={<Login user={user}/>}/>
          <Route path='/register' element={<Register user={user} />}/>
          <Route path='/home' element={<ProtectedRoute user={user} children={<Home />} />}/>
        </Routes>    
      </BrowserRouter>)
      }
    </main>
  )
}

export default App;
