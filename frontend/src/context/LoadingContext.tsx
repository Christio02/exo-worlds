import { createContext, ReactNode, useContext, useState } from 'react';

interface LoaderContextProps {
  showLoader: boolean;
  setShowLoader: (show: boolean) => void;
}

const LoaderContext = createContext<LoaderContextProps | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [showLoader, setShowLoader] = useState<boolean>(false);

  return (
    <LoaderContext.Provider value={{ showLoader, setShowLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = (): LoaderContextProps => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
};
