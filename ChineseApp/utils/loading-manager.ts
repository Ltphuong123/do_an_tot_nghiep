import { useLoadingContext } from "@/contexts/loadingContext";

/**
 * Custom hook để sử dụng loading functions
 * @returns {Object} Object chứa các hàm startLoading và stopLoading
 */
export const useLoading = () => {
  const { startLoading, stopLoading, isLoading, loadingMessage } =
    useLoadingContext();

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading,
  };
};

/**
 * Utility class để quản lý loading state
 */
export class LoadingManager {
  private static startLoadingFn: ((message?: string) => void) | null = null;
  private static stopLoadingFn: (() => void) | null = null;

  /**
   * Đăng ký các hàm loading để sử dụng globally
   */
  static register(
    startLoading: (message?: string) => void,
    stopLoading: () => void
  ) {
    this.startLoadingFn = startLoading;
    this.stopLoadingFn = stopLoading;
  }

  /**
   * Bắt đầu loading với message tùy chọn
   */
  static startLoading(message?: string) {
    if (this.startLoadingFn) {
      this.startLoadingFn(message);
    } else {
      console.warn("LoadingManager: startLoading function is not registered");
    }
  }

  /**
   * Kết thúc loading
   */
  static stopLoading() {
    if (this.stopLoadingFn) {
      this.stopLoadingFn();
    } else {
      console.warn("LoadingManager: stopLoading function is not registered");
    }
  }

  /**
   * Wrapper function để thực hiện một async function với loading
   */
  static async withLoading<T>(
    asyncFn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> {
    try {
      this.startLoading(loadingMessage);
      const result = await asyncFn();
      return result;
    } finally {
      this.stopLoading();
    }
  }
}
