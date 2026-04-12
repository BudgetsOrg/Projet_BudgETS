import { getUtilisateur } from "../api/UtilisateurApi";
import { EditProfilePicture } from "../components/componentsProfile/EditProfilePicture";
import { ProfileHeader } from "../components/componentsProfile/ProfileHeader";
import { TableInfoProfil } from "../components/componentsProfile/TableInfoProfil";
import type { Utilisateur } from "../interfaces";
import { useEffect, useState } from "react";

export default function PageProfile() {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const monUtilisateur = await getUtilisateur();
      console.log("Utilisateur chargé :", monUtilisateur);
      const utilisateurSansVide = {
        ...monUtilisateur,
        telephone: monUtilisateur.telephone || "",
        date_naissance: monUtilisateur.date_naissance || "",
      };
      setUtilisateur(utilisateurSansVide);
    } catch (error) {
      console.error("Erreur de chargement de l'utilisateur :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleLocalChange = (field: keyof Utilisateur, value: string) => {
    if (!utilisateur) return;
    setUtilisateur({ ...utilisateur, [field]: value ?? "" });
  };

  if (loading) return <div>Chargement...</div>;

  if (!utilisateur) return <div>Impossible de charger le profil</div>;

  return (
    <div>
      <div className="relative flex flex-col items-center space-y-4">
        <ProfileHeader />
        <div className="absolute top-40 left-20">
          <EditProfilePicture
            profilePicture={
              utilisateur.image || "../public/img/image_avatar_default.png"
            }
            onImageUpdated={loadUser}
          />
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-10 w-full md:w-3/4 lg:w-1/2 mx-auto">
        <TableInfoProfil
          user={utilisateur}
          changementUtilisateur={handleLocalChange}
          onRefresh={loadUser}
        />
      </div>
    </div>
  );
}
