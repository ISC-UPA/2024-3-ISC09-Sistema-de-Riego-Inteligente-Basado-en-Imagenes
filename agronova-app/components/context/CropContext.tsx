import React, { createContext, useState, ReactNode } from 'react';

// Definir los tipos del contexto
interface CropContextType {
  selectedCropId: number | null;
  setSelectedCropId: (id: number | null) => void;
  clearCropId: () => void;

  record: boolean;  
  setRecord: (value: boolean) => void;  

  statistics: boolean;  
  setStatistics: (value: boolean) => void; 
  
  addCrop: boolean;  
  setAddCrop: (value: boolean) => void;  

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
  const [record, setRecord] = useState<boolean>(false);  
  const [statistics, setStatistics] = useState<boolean>(false);
  const [addCrop, setAddCrop] = useState<boolean>(false);  

  // Función para borrar el crop id
  const clearCropId = () => {
    setSelectedCropId(null);
  };

  return (
    <CropContext.Provider value={{ 
      selectedCropId, setSelectedCropId, clearCropId, 
      record, setRecord, 
      statistics, setStatistics ,
      addCrop, setAddCrop 
      }}>
      {children}
    </CropContext.Provider>
  );
};
