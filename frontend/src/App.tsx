import { BrowserRouter, Route, Routes } from "react-router-dom"; // pour avoir accès au npm install react-router-dom
import "./style/style.css";
import Header from "./components/Header";
import Inscription from "./pages/Inscription";
import PagePrincipale from "./pages/PagePrincipale";
import Connexion from "./pages/Connexion";
import Enveloppe from "./pages/Enveloppe";

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
