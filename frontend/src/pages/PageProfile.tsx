// Justine

import { getLoggedInUser } from "../api/userApi";
import { EditProfilePicture } from "../components/componentsProfile/EditProfilePicture";
import { ProfileHeader } from "../components/componentsProfile/ProfileHeader";
import { TableInfoProfil } from "../components/componentsProfile/TableInfoProfil";

// + popup suppression Justine
export function PageProfile() {
  const user = getLoggedInUser(); // This will throw an error if no user is logged in, which is fine for now as we are just testing the profile page with a mock user. We should handle this more gracefully in a real application.
  return (
    <div>
      <div className="relative flex flex-col items-center space-y-4">
        <ProfileHeader />
        <div className="absolute top-40 left-20">
          <EditProfilePicture profilePicture={user.image} />
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-10 w-full md:w-3/4 lg:w-1/2 mx-auto">
        <TableInfoProfil {...user} />
      </div>
    </div>
  );
}

export default PageProfile;
