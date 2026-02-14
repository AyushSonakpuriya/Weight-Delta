import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import About from './pages/About';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import History from './pages/History';
import { supabase } from './lib/supabase';
import './App.css';

// Wrapper component to access location
function AppContent({ session }) {
  return (
    <div className="app">
      <Navbar session={session} />
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
          <Route
            path="/signup"
            element={session ? <Navigate to="/calculator" replace /> : <SignUp />}
          />
          <Route
            path="/history"
            element={session ? <History /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Global click spark effect
  useEffect(() => {
    const createSparks = (e) => {
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement("div");
        spark.className = "global-spark";
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;

        const angle = (Math.PI * 2 / sparkCount) * i + (Math.random() - 0.5) * 0.5;
        const distance = 30 + Math.random() * 50;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance;

        spark.style.setProperty('--dx', `${dx}px`);
        spark.style.setProperty('--dy', `${dy}px`);

        document.body.appendChild(spark);

        setTimeout(() => spark.remove(), 500);
      }
    };

    window.addEventListener("click", createSparks);

    return () => {
      window.removeEventListener("click", createSparks);
    };
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppContent session={session} />
    </BrowserRouter>
  );
}

export default App;
