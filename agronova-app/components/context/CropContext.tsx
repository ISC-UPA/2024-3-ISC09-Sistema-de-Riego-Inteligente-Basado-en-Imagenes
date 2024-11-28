import React, { createContext, useState, ReactNode } from 'react';

// Definir los tipos del contexto
interface CropContextType {
  selectedCropId: number | null;
  setSelectedCropId: (id: number | null) => void;
  clearCropId: () => void;

  selectedCropName: string | null;
  setSelectedCropName: (name: string | null) => void;
  clearSelectedCropName: () => void;

  selectedCropLocation: string | null;
  setSelectedCropLocation: (name: string | null) => void;
  clearSelectedCropLocation: () => void;

  selectedCropDevice: string | null;
  setSelectedCropDevice: (name: string | null) => void;
  clearSelectedCropDevice: () => void;

  record: boolean;  
  setRecord: (value: boolean) => void;  

  statistics: boolean;  
  setStatistics: (value: boolean) => void; 
  
  addCrop: boolean;  
  setAddCrop: (value: boolean) => void; 

  updateCrop: boolean;  
  setUpdateCrop: (value: boolean) => void; 
  
  //updateCrop:[];
  //setVar1:[
    //{
      //asda:string;
      //qwe:number;
    //}
  //]

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
  const [selectedCropName, setSelectedCropName] = useState<string | null>(null);
  const [selectedCropLocation, setSelectedCropLocation] = useState<string | null>(null);
  const [selectedCropDevice, setSelectedCropDevice] = useState<string | null>(null);
  const [record, setRecord] = useState<boolean>(false);  
  const [statistics, setStatistics] = useState<boolean>(false);
  const [addCrop, setAddCrop] = useState<boolean>(false);  
  const [updateCrop, setUpdateCrop] = useState<boolean>(false);  

  // Función para borrar el crop id
  const clearCropId = () => {
    setSelectedCropId(null);
  };

  const clearSelectedCropName = () => {
    setSelectedCropName(null);
  };

  const clearSelectedCropLocation = () => {
    setSelectedCropLocation(null);
  };

  const clearSelectedCropDevice = () => {
    setSelectedCropDevice(null);
  };

  return (
    <CropContext.Provider value={{ 
        selectedCropId, setSelectedCropId, clearCropId, 
        selectedCropName, setSelectedCropName, clearSelectedCropName, 
        selectedCropLocation, setSelectedCropLocation, clearSelectedCropLocation, 
        selectedCropDevice, setSelectedCropDevice, clearSelectedCropDevice, 
        record, setRecord, 
        statistics, setStatistics,
        addCrop, setAddCrop, 
        updateCrop, setUpdateCrop 
      }}>
      {children}
    </CropContext.Provider>
  );
};
