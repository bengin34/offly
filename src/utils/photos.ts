import { File, Directory, Paths } from "expo-file-system/next";
import { generateUUID } from "./uuid";

const PHOTOS_DIR_NAME = "photos";

/**
 * Gets the photos directory, ensuring it exists.
 */
async function getPhotosDirectory(): Promise<Directory> {
  const photosDir = new Directory(Paths.document, PHOTOS_DIR_NAME);
  if (!photosDir.exists) {
    await photosDir.create();
  }
  return photosDir;
}

/**
 * Copies a photo from a temporary URI (e.g., from ImagePicker cache)
 * to the app's persistent document directory.
 *
 * @param tempUri - The temporary URI from ImagePicker
 * @returns The persistent URI in the document directory
 */
export async function persistPhoto(tempUri: string): Promise<string> {
  const photosDir = await getPhotosDirectory();
  const photosDirUri = photosDir.uri;

  // Check if already in our photos directory (already persisted)
  if (tempUri.startsWith(photosDirUri)) {
    return tempUri;
  }

  // Generate unique filename
  const extension = getFileExtension(tempUri);
  const filename = `${generateUUID()}${extension}`;

  // Create source file reference and copy to photos directory
  const sourceFile = new File(tempUri);
  const destFile = new File(photosDir, filename);

  await sourceFile.copy(destFile);

  return destFile.uri;
}

/**
 * Copies multiple photos to persistent storage.
 *
 * @param tempUris - Array of temporary URIs
 * @returns Array of persistent URIs
 */
export async function persistPhotos(tempUris: string[]): Promise<string[]> {
  const persistentUris: string[] = [];

  for (const tempUri of tempUris) {
    try {
      const persistentUri = await persistPhoto(tempUri);
      persistentUris.push(persistentUri);
    } catch (error) {
      console.warn("Failed to persist photo:", error);
      // Keep original URI if copy fails
      persistentUris.push(tempUri);
    }
  }

  return persistentUris;
}

/**
 * Deletes a photo file from the document directory.
 * Safe to call even if the file doesn't exist.
 *
 * @param uri - The photo URI to delete
 */
export async function deletePhotoFile(uri: string): Promise<void> {
  try {
    const photosDir = await getPhotosDirectory();
    const photosDirUri = photosDir.uri;

    // Only delete if it's in our photos directory
    if (!uri.startsWith(photosDirUri)) {
      return;
    }

    const file = new File(uri);
    if (file.exists) {
      await file.delete();
    }
  } catch (error) {
    // Silently ignore deletion errors - file may already be gone
    console.warn("Failed to delete photo file:", error);
  }
}

/**
 * Deletes multiple photo files.
 *
 * @param uris - Array of photo URIs to delete
 */
export async function deletePhotoFiles(uris: string[]): Promise<void> {
  for (const uri of uris) {
    await deletePhotoFile(uri);
  }
}

/**
 * Gets the file extension from a URI.
 */
function getFileExtension(uri: string): string {
  const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
  if (match) {
    return `.${match[1].toLowerCase()}`;
  }
  return ".jpg"; // Default to jpg
}

/**
 * Checks if a photo URI points to an existing file.
 *
 * @param uri - The photo URI to check
 * @returns true if the file exists
 */
export async function photoExists(uri: string): Promise<boolean> {
  try {
    const file = new File(uri);
    return file.exists;
  } catch {
    return false;
  }
}
