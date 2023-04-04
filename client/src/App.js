import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Register from './page/Register'
import Login from './page/Login'
import Chat from './page/Chat'
import PageNotFound from './page/PageNotFound';
import SetAvatar from './page/SetAvatar';

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen to the online status
    window.addEventListener('online', handleStatusChange);

    // Listen to the offline status
    window.addEventListener('offline', handleStatusChange);

    // Specify how to clean up after this effect for performance improvment
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, [isOnline]);
  return (
    <Router>
      <Routes>
        <Route exact path="/register" element={<Register isOnline={isOnline} />} />
        <Route exact path="/login" element={<Login isOnline={isOnline} />} />
        <Route exact path="/setAvatar" element={<SetAvatar isOnline={isOnline} />} />
        <Route exact path="/" element={<Chat isOnline={isOnline} />} />
        <Route exactpath="*" element={<PageNotFound isOnline={isOnline} />} />
      </Routes>
    </Router>
  );
}

export default App;
