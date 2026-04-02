import SectionPrincipale from "../../components/componentsAccueil/sectionPrincipale";
import Titre from "../../components/componentsAccueil/titre";
import Sous_Section from "../../components/componentsAccueil/Sous_Section";
export default function Accueuil() {
  return (
    <div className="bg-[#FDF7EB] h-screen w-full">
      <Titre />
      <SectionPrincipale />
      <Sous_Section />
    </div>
  );
}
