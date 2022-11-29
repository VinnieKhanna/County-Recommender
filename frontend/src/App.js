import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router";
import InfoCollection from './components/InfoCollection';
import PastLivingHistory from './components/PastLivingHistory';
import Recommendations from './components/Recommendations';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<Home />} />
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
        <button onClick={() => navigate("info-collection")}> 
          Info Collection
        </button>
      </header>
      </div>
  )

}

export default App;
