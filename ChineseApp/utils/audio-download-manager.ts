import {
  deleteAsync,
  documentDirectory,
  downloadAsync,
  getInfoAsync,
  makeDirectoryAsync,
  readDirectoryAsync,
} from "expo-file-system/legacy";

export interface LocalAudioFile {
  originalUrl: string;
  localPath: string;
  downloadedAt: string;
  fileName: string;
}

export class AudioDownloadManager {
  private static readonly AUDIO_DIR = `${documentDirectory}audio/`;

  /**
   * Initialize audio directory
   */
  static async initializeAudioDirectory(): Promise<void> {
    try {
      const dirInfo = await getInfoAsync(this.AUDIO_DIR);
      if (!dirInfo.exists) {
        await makeDirectoryAsync(this.AUDIO_DIR, {
          intermediates: true,
        });
      }
    } catch (error) {
      console.error("Error initializing audio directory:", error);
      throw error;
    }
  }

  /**
   * Generate unique filename from URL using simple hash
   */
  private static generateFileName(url: string): string {
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
      const char = url.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    const hashStr = Math.abs(hash).toString(16);
    const extension = url.split(".").pop()?.split("?")[0] || "mp3";
    return `audio_${hashStr}.${extension}`;
  }

  /**
   * Download audio file from URL and save locally
   */
  static async downloadAudio(
    url: string,
    onProgress?: (progress: number) => void
  ): Promise<LocalAudioFile> {
    try {
      await this.initializeAudioDirectory();

      const fileName = this.generateFileName(url);
      const localPath = `${this.AUDIO_DIR}${fileName}`;

      // Check if file already exists
      const fileInfo = await getInfoAsync(localPath);
      if (fileInfo.exists) {
        return {
          originalUrl: url,
          localPath,
          fileName,
          downloadedAt: new Date(
            fileInfo.modificationTime! * 1000
          ).toISOString(),
        };
      }

      // Download file
      const downloadResult = await downloadAsync(url, localPath);

      if (downloadResult.status !== 200) {
        throw new Error(
          `Failed to download audio: HTTP ${downloadResult.status}`
        );
      }

      return {
        originalUrl: url,
        localPath: downloadResult.uri,
        fileName,
        downloadedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error downloading audio:", error);
      throw error;
    }
  }

  /**
   * Download multiple audio files with progress tracking
   */
  static async downloadMultipleAudios(
    urls: string[],
    onProgress?: (currentIndex: number, totalCount: number) => void
  ): Promise<LocalAudioFile[]> {
    const results: LocalAudioFile[] = [];

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      try {
        onProgress?.(i, urls.length);
        const localAudio = await this.downloadAudio(url);
        results.push(localAudio);
      } catch (error) {
        console.warn(`Failed to download audio ${url}:`, error);
        // Continue with other downloads even if one fails
      }
    }

    return results;
  }

  /**
   * Get local audio file info if exists
   */
  static async getLocalAudioFile(url: string): Promise<LocalAudioFile | null> {
    try {
      const fileName = this.generateFileName(url);
      const localPath = `${this.AUDIO_DIR}${fileName}`;

      const fileInfo = await getInfoAsync(localPath);
      if (fileInfo.exists) {
        return {
          originalUrl: url,
          localPath,
          fileName,
          downloadedAt: new Date(
            fileInfo.modificationTime! * 1000
          ).toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error("Error getting local audio file:", error);
      return null;
    }
  }

  /**
   * Delete local audio file
   */
  static async deleteAudioFile(url: string): Promise<boolean> {
    try {
      const fileName = this.generateFileName(url);
      const localPath = `${this.AUDIO_DIR}${fileName}`;

      const fileInfo = await getInfoAsync(localPath);
      if (fileInfo.exists) {
        await deleteAsync(localPath);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting audio file:", error);
      return false;
    }
  }

  /**
   * Clean up all audio files
   */
  static async clearAllAudioFiles(): Promise<void> {
    try {
      const dirInfo = await getInfoAsync(this.AUDIO_DIR);
      if (dirInfo.exists) {
        await deleteAsync(this.AUDIO_DIR);
      }
    } catch (error) {
      console.error("Error clearing audio files:", error);
      throw error;
    }
  }

  /**
   * Get total size of downloaded audio files
   */
  static async getStorageSize(): Promise<number> {
    try {
      const dirInfo = await getInfoAsync(this.AUDIO_DIR);
      if (!dirInfo.exists) return 0;

      const files = await readDirectoryAsync(this.AUDIO_DIR);
      let totalSize = 0;

      for (const file of files) {
        const filePath = `${this.AUDIO_DIR}${file}`;
        const fileInfo = await getInfoAsync(filePath);
        if (fileInfo.exists && fileInfo.size) {
          totalSize += fileInfo.size;
        }
      }

      return totalSize;
    } catch (error) {
      console.error("Error calculating storage size:", error);
      return 0;
    }
  }
}
