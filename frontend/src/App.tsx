import { BrowserRouter, Route, Routes } from "react-router-dom"; // pour avoir accès au npm install react-router-dom
import "./style/style.css";
import Inscription from "./Inscription";
import PagePrincipale from "./PagePrincipale";
import PageProfile from "./Profile";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<PagePrincipale />} />
          <Route path="/Inscription" element={<Inscription />} />
          <Route path="/Profil" element={<PageProfile />} />
          <Route />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
