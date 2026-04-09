import React from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./style/style.css";

//import axios from "axios"; // Vérifier si l'utilisateur est connecté.

import Header from "./components/Header";
import Inscription from "./pages/Inscription";
import PagePrincipale from "./pages/PagePrincipale";
import Connexion from "./pages/Connexion";
import Enveloppe from "./pages/Enveloppe";
import { PageProfile } from "./pages/PageProfile";
import Accueuil from "./pages/Accueuil";
import EducationFinanciere from "./pages/EducationFinanciere";
import PageMdpOublie from "./pages/PageMotDePasseOublie";
import PageObjectifs from "./pages/Objectifs";
import PageCreationNouveauMdp from "./pages/PageCreationNouveauMdp"


function AppContent() {
  const location = useLocation();

  // Pages où on NE veut pas afficher le header
  const noHeaderRoutes = ["/PageConnexion", "/PageInscription","/PageMdpOublie","/PageCreationNouveauMdp"];

  const showHeader = !noHeaderRoutes.includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}

      {/*<div style={{paddingTop : showHeader ? "68px" : "0"}}>*/}
      <Routes>
        <Route path="/" element={<Accueuil />} />
        <Route path="/PageConnexion" element={<Connexion />} />
        <Route path="/PageInscription" element={<Inscription />} />
        <Route path="/PagePrincipale" element={<PagePrincipale />} />
        <Route path="/PageEnveloppe" element={<Enveloppe />} />
        <Route path="/Profile" element={<PageProfile />} />
        <Route path="/PageObjectifs" element={<PageObjectifs />} />
        <Route path="/PageMdpOublie" element={<PageMdpOublie />} />
        <Route path="/EducationFinanciere" element={<EducationFinanciere />} />
        <Route path="/PageCreationNouveauMdp" element = {<PageCreationNouveauMdp />} />
      </Routes>
      {/*</div>*/}
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
