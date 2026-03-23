import { BrowserRouter, Route, Routes } from "react-router-dom"; // pour avoir accès au npm install react-router-dom
import "./style/style.css";
import Header from "./Header";
import Inscription from "./Inscription";
import PagePrincipale from "./PagePrincipale";
import Connexion from "./Connexion";
import Enveloppe from "./Enveloppe";

function App() {
  return (
      <div className="App">
      <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PagePrincipale />} />
            <Route path="/Inscription" element={<Inscription />} />
            <Route path="/Connexion" element={<Connexion />} />
            <Route path="/Enveloppe" element={<Enveloppe />} />
          </Routes>
        </BrowserRouter>
      </div>

  );
}

export default App;
