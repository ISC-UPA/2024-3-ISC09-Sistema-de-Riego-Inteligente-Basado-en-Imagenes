import React, { createContext, useState, ReactNode } from 'react';

// Definir los tipos del contexto
interface OrganizationContextType {
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;
  clearUserId: () => void;

  help: boolean;  
  setHelp: (value: boolean) => void;  

  addMember: boolean;
  setAddMember: (value : boolean ) => void;

  updateMember: boolean;
  setUpdateMember: (value : boolean ) => void;

}

// Inicializamos el contexto con valores por defecto
export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Tipos para las props del proveedor
interface OrganizationProviderProps {
  children: ReactNode;
}

// Crear el proveedor del contexto
export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [help, setHelp] = useState<boolean>(false);  
  const [addMember, setAddMember] = useState<boolean>(false);  
  const [updateMember, setUpdateMember] = useState<boolean>(false);  

  // Función para borrar el crop id
  const clearUserId = () => {
    setSelectedUserId(null);
  };

  return (
    <OrganizationContext.Provider value={{ 
      selectedUserId, setSelectedUserId, clearUserId, 
      help, setHelp, addMember, setAddMember, updateMember, setUpdateMember
      }}>
      {children}
    </OrganizationContext.Provider>
  );
};
