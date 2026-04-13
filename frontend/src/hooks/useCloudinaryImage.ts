import { useState, useCallback } from "react";
import {
  uploadImageToCloudinary,
  type CloudinaryFolder,
} from "../utils/cloudinaryUpload";

interface UseCloudinaryImageOptions {
  initialUrl?: string | null;
  folder?: CloudinaryFolder;
}

interface UseCloudinaryImageResult {
  previewUrl: string | null;
  file: File | null;
  uploading: boolean;
  error: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  upload: () => Promise<string | null>;
  reset: (newInitialUrl?: string | null) => void;
}

export function useCloudinaryImage(
  options: UseCloudinaryImageOptions = {},
): UseCloudinaryImageResult {
  const { initialUrl = null, folder } = options;

  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0] || null;
      if (!selectedFile) return;

      setFile(selectedFile);
      setError(null);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    },
    [],
  );

  const upload = useCallback(async (): Promise<string | null> => {
    if (!file) {
      return null; // Pas de nouvelle image sélectionnée
    }

    setUploading(true);
    setError(null);

    try {
      const url = await uploadImageToCloudinary(file, { folder });
      return url;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Erreur inconnue lors de l'upload de l'image";
      setError(message);
      throw err;
    } finally {
      setUploading(false);
    }
  }, [file, folder]);

  const reset = useCallback(
    (newInitialUrl: string | null = initialUrl) => {
      setFile(null);
      setPreviewUrl(newInitialUrl);
      setError(null);
      setUploading(false);
    },
    [initialUrl],
  );

  return {
    previewUrl,
    file,
    uploading,
    error,
    onFileChange,
    upload,
    reset,
  };
}
