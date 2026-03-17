import { useState } from "react";
import React from "react";
import ReactDom from "react-dom";
import { BrowserRouter,Route, Routes} from "react-router-dom"; // pour avoir accès au npm install react-router-dom
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Inscription from "./Inscription";
import PagePrincipale  from "./PagePrincipale";

/*function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <h1 className="text-3xl font-bold underline">Hello world !</h1>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}
  */
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element = {<PagePrincipale/>}/>
          <Route path="/Inscription" element = {<Inscription/>}/>
          <Route/>
          <Route/>
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
