// Mohamed
function Connexion() {

    
const redirigerPageInscription = () => {
    window.location.href = "/PageInscription";
}
    return (
        <>
        <div className="page_connexion">
            <div className="connexion_container">
                <div className="container_gauche">
                    <img src="/img/image_inscription_plante.png" className="image_connexion"/>
                </div>
                <div className="connexion_information">
                    <h1>Connexion</h1>
                    <input type="email" name="btn_email" placeholder="Adresse email" />
                    <input type="password" name="btn_password" placeholder="Mot de passe" />
                    <label>Mot de passe oublié ?</label>
                    <button className="btn_connexion" type="submit">Connexion</button>
                    <button className="btn_inscription" type="submit" onClick={redirigerPageInscription}>S'inscrire</button>

                    
                </div>

                
                <div className="triangle triangle-droite"/>
                <div className="triangle triangle-gauche"/>

            </div>
        </div>
        </>
    );
}
export default Connexion;
/*import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adresse_email: email, password: password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard"); // redirect to main page after login
    } else {
      alert("Email ou mot de passe incorrect");
    }
  };
  return (
    <>
      <div className="connexion_container">
        <div className="container_gauche">
          <img
            src="/img/image_inscription_plante.png"
            className="image_connexion"
          />
        </div>
        <div className="connexion_information">
          <h1>Connexion</h1>
          <input
            type="email"
            name="btn_email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            name="btn_password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>Mot de passe oublié ?</label>
          <button className="btn_connexion" type="submit" onClick={handleLogin}>
            Connexion
          </button>
          <button className="btn_inscription" type="submit">
            S'inscrire
          </button>
        </div>

        <div className="triangle triangle-droite" />
        <div className="triangle triangle-gauche" />
      </div>
    </>
  );
}
export default Connexion;
*/
