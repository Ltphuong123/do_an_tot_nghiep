import React, { createContext, useContext, useState } from "react";

interface SpeechRecognitionContextType {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

const SpeechRecognitionContext = createContext<
  SpeechRecognitionContextType | undefined
>(undefined);

export const SpeechRecognitionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isListening, setIsListening] = useState(false);

  return (
    <SpeechRecognitionContext.Provider value={{ isListening, setIsListening }}>
      {children}
    </SpeechRecognitionContext.Provider>
  );
};

export const useSpeechRecognition = () => {
  const context = useContext(SpeechRecognitionContext);
  if (!context) {
    throw new Error(
      "useSpeechRecognition must be used within SpeechRecognitionProvider"
    );
  }
  return context;
};
