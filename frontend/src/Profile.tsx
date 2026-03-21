// Justine

import { getLoggedInUser } from "./api/userApi";
import { EditProfilePicture } from "./components/Profile/EditProfilePicture";
import { ProfileHeader } from "./components/Profile/ProfileHeader";
import { TableInfoProfil } from "./components/Profile/TableInfoProfil";

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
      <div className="px-10 w-1/2 h-full mx-auto">
        <TableInfoProfil {...user} />
      </div>
    </div>
  );
}

export default PageProfile;
