import { AudioDownloadManager } from "@/utils/audio-download-manager";
import { Audio } from "expo-av";

let currentSound: Audio.Sound | null = null;
let isPaused = false;
let isPlaying = false;
// Simple async lock to serialize play requests and avoid race conditions
let _playLock: Promise<void> = Promise.resolve();
let _currentUnlock: (() => void) | null = null;
let currentAbortController: AbortController | null = null;
let isStopping = false;
let stoppingPromise: Promise<void> | null = null;

/**
 * Phát 1 file audio local (require)
 */
export const playLocalAudio = async (
  source: number,
  onFinished?: () => void
): Promise<void> => {
  await playAudio({ source, onFinished });
};

/**
 * Phát 1 file audio từ đường dẫn online (BE trả về)
 * Tự động sử dụng file local nếu có
 */
export const playRemoteAudio = async (
  url: string,
  onFinished?: () => void,
  onStatusUpdate?: (status: import("expo-av").AVPlaybackStatus) => void
): Promise<void> => {
  try {
    // Check if we have a local copy first
    const localAudioFile = await AudioDownloadManager.getLocalAudioFile(url);

    if (localAudioFile) {
      console.log("🎵 Using local audio file:", localAudioFile.localPath);
      await playAudio({
        uri: localAudioFile.localPath,
        onFinished,
        onStatusUpdate,
      });
    } else {
      console.log("🎵 Using remote audio URL:", url);
      await playAudio({ uri: url, onFinished, onStatusUpdate });
    }
  } catch (error) {
    console.warn("🎵 Failed to play audio (local/remote):", error);
    // Fallback to original remote URL
    await playAudio({ uri: url, onFinished, onStatusUpdate });
  }
};

/**
 * Phát 1 file audio local (đóng gói trong app)
 * @param source require() của file audio, ví dụ: require("../assets/audio.mp3")
 */
const playAudio = async ({
  source,
  uri,
  onFinished,
  onStatusUpdate,
}: {
  source?: number;
  uri?: string;
  onFinished?: () => void;
  onStatusUpdate?: (status: import("expo-av").AVPlaybackStatus) => void;
}): Promise<void> => {
  // Wait for any ongoing stop operation to complete
  if (stoppingPromise) await stoppingPromise;

  // Acquire async lock so two play requests don't run concurrently
  let _unlock: (() => void) | undefined;
  const _prev = _playLock;
  _playLock = new Promise<void>((res) => {
    _unlock = res;
    _currentUnlock = res;
  });
  try {
    await _prev;

    console.log("🎵 Phát audio:", source || uri);

    // If already playing, stop current audio first
    // Note: stop is handled in caller, so no need here
    // if (isPlaying) {
    //   await stopAudio();
    // }

    // Set playing flag
    isPlaying = true;

    // Tạo audio
    const { sound } = await Audio.Sound.createAsync(
      source ? source : { uri: uri! },
      {
        shouldPlay: true,
        volume: 1.0,
        isLooping: false,
      }
    );

    currentSound = sound;
    console.log("🎵 Audio đang phát...");

    // Giải phóng sau khi phát xong
    sound.setOnPlaybackStatusUpdate((status) => {
      // Forward status to caller if provided
      try {
        onStatusUpdate && onStatusUpdate(status as any);
      } catch (err) {
        console.error("🎵 Lỗi trong onStatusUpdate callback:", err);
      }

      if (status.isLoaded && status.didJustFinish) {
        console.log("🎵 Phát xong audio");
        // Unload sound
        sound.unloadAsync().catch(() => {});
        if (currentSound === sound) currentSound = null;
        isPlaying = false; // Reset playing flag
        // Gọi callback nếu có
        try {
          onFinished && onFinished();
        } catch (err) {
          console.error("🎵 Lỗi khi gọi onFinished:", err);
        }
      }
    });
  } catch (error) {
    console.error("🎵 Lỗi khi phát audio:", error);

    if (currentSound) {
      try {
        await currentSound.unloadAsync();
      } catch {}
      currentSound = null;
    }
    isPlaying = false; // Reset playing flag on error
  } finally {
    // Release the lock for the next play request
    _unlock && _unlock();
    _currentUnlock = null;
  }
};

/**
 * Trả về trạng thái playback hiện tại (null nếu chưa có âm thanh nào load)
 */
export const getCurrentPlaybackStatus = async () => {
  try {
    if (currentSound) {
      const status = await currentSound.getStatusAsync();
      return status;
    }
  } catch (err) {
    console.error("🎵 Lỗi khi lấy playback status:", err);
  }
  return null;
};

export const playSequentialAudios = async (
  sources: (number | string)[]
): Promise<void> => {
  // Wait for any ongoing stop operation to complete
  if (stoppingPromise) await stoppingPromise;

  // Serialize sequential playback with the same lock to avoid races
  let _unlockSeq: (() => void) | undefined;
  const _prev = _playLock;
  _playLock = new Promise<void>((res) => {
    _unlockSeq = res;
    _currentUnlock = res;
  });
  currentAbortController = new AbortController();
  try {
    await _prev;

    for (const source of sources) {
      // If already playing, stop current audio first
      if (isPlaying) {
        await stopAudio();
      }

      // Set playing flag
      isPlaying = true;

      // Chuẩn bị source phù hợp cho Audio.Sound.createAsync
      const soundSource = typeof source === "string" ? { uri: source } : source;

      // Tạo và phát file hiện tại
      const { sound } = await Audio.Sound.createAsync(soundSource, {
        shouldPlay: true,
      });
      currentSound = sound;

      // Đợi file phát xong
      await new Promise<void>((resolve) => {
        const abort = currentAbortController;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (abort && abort.signal.aborted) {
            resolve();
            return;
          }
          if (status.isLoaded && status.didJustFinish) {
            isPlaying = false; // Reset playing flag
            resolve();
          }
        });
      });
    }

    // Xong hết thì dọn bộ nhớ
    if (currentSound) {
      await currentSound.unloadAsync();
      currentSound = null;
    }
    isPlaying = false; // Ensure flag is reset
  } catch (error) {
    console.error("🎧 Lỗi khi phát audio liên tiếp:", error);
    isPlaying = false; // Reset flag on error
  } finally {
    _unlockSeq && _unlockSeq();
    _currentUnlock = null;
    currentAbortController = null;
  }
};

/**
 * Hàm dừng audio nếu đang phát
 */
export const stopAudio = async (): Promise<void> => {
  if (isStopping) return stoppingPromise || Promise.resolve();
  isStopping = true;
  stoppingPromise = (async () => {
    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        currentSound = null;
        isPaused = false;
        isPlaying = false; // Reset playing flag
        // Release the lock if it was waiting
        if (_currentUnlock) {
          _currentUnlock();
          _currentUnlock = null;
        }
        // Abort any ongoing sequential play
        if (currentAbortController) {
          currentAbortController.abort();
          currentAbortController = null;
        }
      }
    } catch {
      // Ignore errors when stopping
    } finally {
      isStopping = false;
      stoppingPromise = null;
    }
  })();
  return stoppingPromise;
};

export const pauseAudio = async (): Promise<void> => {
  if (currentSound) {
    const status = await currentSound.getStatusAsync();
    if (status.isLoaded && status.isPlaying) {
      await currentSound.pauseAsync();
      isPaused = true;
      isPlaying = false; // Reset playing flag when paused
    }
  }
};

/**
 * Tiếp tục phát nếu đã tạm dừng
 */
export const resumeAudio = async (): Promise<void> => {
  if (currentSound && isPaused) {
    await currentSound.playAsync();
    isPaused = false;
    isPlaying = true; // Set playing flag when resumed
  }
};
