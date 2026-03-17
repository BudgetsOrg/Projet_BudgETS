//Mohamed
// Page d'inscription pour les nouveaux utilisateurs
function Inscription() {
  return (
    <>
      <h1 className="titre">Inscription</h1>
      <p>Remplissez les informations suivantes :</p>
      <form>
        <input type="text" placeholder="Nom d'utilisateur" />
        <input type="email" placeholder="Adresse email" />
        <input type="password" placeholder="Mot de passe" />
        <button type="submit">S'inscrire</button>
      </form>
    </>
  );
}
export default Inscription;
