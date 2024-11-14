// CropContext.tsx
import React, { createContext, useState, ReactNode } from 'react';

// Definir los tipos del contexto
interface CropContextType {
  selectedCropId: number | null;
  setSelectedCropId: (id: number | null) => void;
}

// Inicializamos el contexto con valores por defecto
export const CropContext = createContext<CropContextType | undefined>(undefined);

// Tipos para las props del proveedor
interface CropProviderProps {
  children: ReactNode;
}

// Crear el proveedor del contexto
export const CropProvider: React.FC<CropProviderProps> = ({ children }) => {
  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);

  return (
    <CropContext.Provider value={{ selectedCropId, setSelectedCropId }}>
      {children}
    </CropContext.Provider>
  );
};
