import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [txt, setTxt] = useState("");
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
      </header>
    </div>
  );
}

export default App;
