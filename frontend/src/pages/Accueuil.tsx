import SectionPrincipale from "../components/componentsAccueil/SectionPrincipale";
import Titre from "../components/componentsAccueil/Titre";
import Sous_Section from "../components/componentsAccueil/Sous_Section";
export default function Accueuil() {
  return (
    <div className="bg-gradient-to-br from-[#FDF7EB] to-white h-full w-full">
      <Titre />
      <SectionPrincipale />
      <Sous_Section />
    </div>
  );
}
