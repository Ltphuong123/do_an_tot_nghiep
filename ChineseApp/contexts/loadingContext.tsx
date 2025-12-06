import React, { createContext, ReactNode, useContext, useState } from "react";

type LoadingContextType = {
  isLoading: boolean;
  loadingMessage?: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoadingContext must be used within LoadingProvider");
  }
  return context;
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();

  const startLoading = (message?: string) => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage(undefined);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingMessage,
        startLoading,
        stopLoading,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};
