import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./style/style.css";

import Header from "./components/componentsHeader/Header";
import Footer from "./components/Footer";
import Inscription from "./pages/Inscription";
import PagePrincipale from "./pages/PagePrincipale";
import Connexion from "./pages/Connexion";
import Enveloppe from "./pages/Enveloppe";
import PageProfile from "./pages/PageProfile";
import Accueuil from "./pages/Accueuil";
import EducationFinanciere from "./pages/EducationFinanciere";
import PageMdpOublie from "./pages/PageMotDePasseOublie";
import PageObjectifs from "./pages/Objectifs";
import PageCreationNouveauMdp from "./pages/PageCreationNouveauMdp";
import CategoriesDeDepense from "./pages/CategoriesDeDepense";

//Cette fonction est la classe Principale qui permet de gérer 
//les routes de chaque pages et de donner un chemin en url pour chaque page.
function AppContent() {
  const location = useLocation();

  // Pages où on NE veut pas afficher le header
  const noHeaderRoutes = [
    "/PageConnexion",
    "/PageInscription",
    "/PageMdpOublie",
    "/PageCreationNouveauMdp",
  ];

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
        <Route path="/PageEnveloppe/:id" element={<Enveloppe />} />
        <Route path="/Profile" element={<PageProfile />} />
        <Route path="/CategoriesDeDepense" element={<CategoriesDeDepense />} />
        <Route path="/PageObjectifs/:id" element={<PageObjectifs />} />
        <Route path="/PageMdpOublie" element={<PageMdpOublie />} />
        <Route path="/EducationFinanciere" element={<EducationFinanciere />} />
        <Route
          path="/PageCreationNouveauMdp"
          element={<PageCreationNouveauMdp />}
        />
      </Routes>
      {showHeader && <Footer />}
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
