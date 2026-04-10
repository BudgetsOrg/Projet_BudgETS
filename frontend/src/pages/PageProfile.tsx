import { getUtilisateur } from "../api/UtilisateurApi";
import { EditProfilePicture } from "../components/componentsProfile/EditProfilePicture";
import { ProfileHeader } from "../components/componentsProfile/ProfileHeader";
import { TableInfoProfil } from "../components/componentsProfile/TableInfoProfil";
import type { Utilisateur } from "../interfaces";
import { useEffect, useState } from "react";

export function PageProfile() {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      setLoading(true);
      const monUtilisateur = await getUtilisateur();
      setUtilisateur(monUtilisateur);
    } catch (error) {
      console.error("Erreur de chargement de l'utilisateur :", error);
      setUtilisateur(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          />
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-10 w-full md:w-3/4 lg:w-1/2 mx-auto">
        <TableInfoProfil user={utilisateur} />
      </div>
    </div>
  );
}

export default PageProfile;
