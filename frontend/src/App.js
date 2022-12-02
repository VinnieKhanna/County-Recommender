// Asset Imports
import './App.css';

// React, Router Imports
import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { useNavigate, useLocation } from "react-router";

// Our Component Imports
import Header from './components/Header';
import InfoCollection from './components/InfoCollection';
import PastLivingHistory from './components/PastLivingHistory';
import Recommendations from './components/Recommendations';
import SignUp from './components/SignUp';
import Login from './components/Login';


function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check HTML5 storage and restore "session" by auto-logging in
  // Run only on app mounting (like page refresh)
  useEffect(() => {
    let local = localStorage["flask-jwt-token"];
    let session = sessionStorage["flask-jwt-token"];
    if (session) { // not null/undefined
      setToken(session)
    } else if (local) {
      setToken(local)
    } 
    setUser(localStorage["username"]);

    // On app launch, if new user navigate to login, else to info collection
    if (location.pathname === "/") {
      if (local || session) {
        navigate("/info-collection")
      } else {
        navigate("/login")
      }
    }
  }, [location.pathname, navigate])

  return (
    <div className="App">
      <Header showMenu={Boolean(token)} setToken={setToken} user={user} />
      <Routes>
        <Route path="/sign-up" element={<SignUp token={token} setToken={setToken} setUser={setUser} />} />
        <Route path="/login" element={<Login token={token} setToken={setToken} setUser={setUser} />} />
        <Route path="/info-collection" element={<InfoCollection token={token} />} />
        <Route path="/past-counties" element={<PastLivingHistory token={token} />} />
        <Route path="/recommendations" element={<Recommendations token={token} />} />
      </Routes>
    </div>
  );
}

export default App;
