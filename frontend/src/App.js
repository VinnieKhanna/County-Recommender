// Asset Imports
import logo from './logo.svg';
import './App.css';

// React, Router Imports
import React from 'react'
import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";

// Our Component Imports
import InfoCollection from './components/InfoCollection';
import PastLivingHistory from './components/PastLivingHistory';
import Recommendations from './components/Recommendations';
import SignUp from './components/SignUp';
import Login from './components/Login';

// MUI Imports
import Button from '@mui/material/Button';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/info-collection" element={<InfoCollection />} />
        <Route path="/past-counties" element={<PastLivingHistory />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </div>
  );
}

function Home() {
  const [txt, setTxt] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetch("/test").then(async (res) => {
      console.log(res);
      setTxt(await res.text());
    })
  }, [])

  return (
    <div className="App">
    <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {txt}
        </a>
        <Button sx={{mt: "10px"}} variant="contained" onClick={() => navigate("info-collection")}> 
          Info Collection
        </Button>
      </header>
      </div>
  )

}

export default App;
