export type CloudinaryFolder = "profiles" | "enveloppes" | "objectifs" | string;

interface CloudinaryUploadOptions {
  folder?: CloudinaryFolder;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  url: string;
  [key: string]: unknown;
}

//Should be set in .env file, but hardcoded here for simplicity, not a security issue since these are public values
const CLOUD_NAME = "db9xtq426";
const UPLOAD_PRESET = "budgets_preset";

function ensureConfig() {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary n'est pas configuré. Définissez VITE_CLOUDINARY_CLOUD_NAME et VITE_CLOUDINARY_UPLOAD_PRESET dans votre fichier .env.",
    );
  }
}

export async function uploadImageToCloudinary(
  file: File,
  options: CloudinaryUploadOptions = {},
): Promise<string> {
  ensureConfig();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET!);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Erreur lors de l'upload de l'image sur Cloudinary (${response.status}): ${errorText}`,
    );
  }

  const data = (await response.json()) as CloudinaryUploadResponse;
  return (data.secure_url || data.url) as string;
}
