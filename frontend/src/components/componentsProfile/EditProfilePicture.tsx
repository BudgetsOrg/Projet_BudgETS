import editLogo from "../../img/edit-icon.svg";
//https://www.youtube.com/watch?v=M0CNWMDJOHA

type EditProfilePictureProps = {
  profilePicture: string;
};

export function EditProfilePicture({
  profilePicture,
}: EditProfilePictureProps) {
  return (
    <div className="relative items-center space-y-4">
      <div
        className="w-32 h-32 rounded-full bg-cover bg-center"
        style={{ backgroundImage: `url(${profilePicture})` }}
      ></div>
      <button
        onClick={clicked}
        className="absolute top-25 left-25 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
      >
        <img src={editLogo} alt="Edit" className="w-5 h-5" />
      </button>
    </div>
  );
}
function clicked() {
  // TODO:Should open a file dialog to select a new profile picture
  console.log("Clicked");
}
