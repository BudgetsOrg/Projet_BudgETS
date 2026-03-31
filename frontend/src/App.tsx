import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./style/style.css";

//import axios from "axios"; // Vérifier si l'utilisateur est connecté.

import Header from "./components/Header";
import Inscription from "./pages/Inscription";
import PagePrincipale from "./pages/PagePrincipale";
import Connexion from "./pages/Connexion";
import Enveloppe from "./pages/Enveloppe";

function AppContent() {

  const checkLogIn = () => {

  }

  const location = useLocation();

  // Pages où on NE veut pas afficher le header
  const noHeaderRoutes = ["/PageConnexion", "/PageInscription"];

  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        <Route path="/PageConnexion" element={<Connexion />} />
        <Route path="/PageInscription" element={<Inscription />} />
        <Route path="/PagePrincipale" element={<PagePrincipale />} />
        <Route path="/PageEnveloppe" element={<Enveloppe />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;