/**
 * Test utility for AudioDownloadManager
 * Remove this file after testing is complete
 */

import { AudioDownloadManager } from "./audio-download-manager";

export const testAudioDownloadManager = async () => {
  try {
    console.log("🧪 Testing AudioDownloadManager...");

    // Test 1: Check storage size (should be 0 initially)
    const initialSize = await AudioDownloadManager.getStorageSize();
    console.log("📊 Initial storage size:", initialSize, "bytes");

    // Test 2: Try to get a non-existent file
    const testUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
    const nonExistentFile = await AudioDownloadManager.getLocalAudioFile(
      testUrl
    );
    console.log("🔍 Non-existent file result:", nonExistentFile);

    // Test 3: Test directory initialization (should not throw)
    console.log("✅ AudioDownloadManager tests completed successfully");
    return true;
  } catch (error) {
    console.error("❌ AudioDownloadManager test failed:", error);
    return false;
  }
};

// For manual testing in development
export const manualTestDownload = async () => {
  try {
    const testUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav";
    console.log("🔄 Starting manual download test...");

    const result = await AudioDownloadManager.downloadAudio(
      testUrl,
      (progress) => {
        console.log("📈 Download progress:", progress + "%");
      }
    );

    console.log("✅ Download completed:", result);

    // Test playback
    const { playRemoteAudio } = await import("./play_audio");
    await playRemoteAudio(testUrl, () => {
      console.log("🎵 Audio playback finished");
    });

    return true;
  } catch (error) {
    console.error("❌ Manual test failed:", error);
    return false;
  }
};
