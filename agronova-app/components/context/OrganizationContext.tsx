import React, { createContext, useState, ReactNode } from 'react';

// Definir los tipos del contexto
interface OrganizationContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  clearUserId: () => void;

  userFullName: string | null;
  setUserFullName: (name: string | null) => void;
  clearUserFullName: () => void;

  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  clearUserEmail: () => void;

  help: boolean;  
  setHelp: (value: boolean) => void;  

}

// Inicializamos el contexto con valores por defecto
export const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

// Tipos para las props del proveedor
interface OrganizationProviderProps {
  children: ReactNode;
}

// Crear el proveedor del contexto
export const OrganizationProvider: React.FC<OrganizationProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [help, setHelp] = useState<boolean>(false);  

  // Función para borrar el crop id
  const clearUserId = () => {
    setUserId(null);
  };

  const clearUserFullName = () => {
    setUserFullName(null);
  };

  const clearUserEmail = () => {
    setUserEmail(null);
  };


  return (
    <OrganizationContext.Provider value={{ 
      userId, setUserId, clearUserId, 
      userFullName, setUserFullName, clearUserFullName,
      userEmail, setUserEmail, clearUserEmail,
      help, setHelp, 
      }}>
      {children}
    </OrganizationContext.Provider>
  );
};
