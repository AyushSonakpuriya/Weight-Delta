import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import About from './pages/About';
import Login from './pages/Login';
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      cursor.remove();
    };
  }, []);

  // Session management - check on load and listen for changes
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      console.log('Current Supabase session:', session);
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      console.log('Auth state changed:', event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/calculator"
              element={session ? <Calculator /> : <Navigate to="/login" replace />}
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/login"
              element={session ? <Navigate to="/calculator" replace /> : <Login />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
