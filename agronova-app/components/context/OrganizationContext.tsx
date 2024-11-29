import React, { createContext, useState, ReactNode } from 'react';

// Definir los tipos del contexto
interface OrganizationContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  clearUserId: () => void;

  selectedUserId: string | null;
  setSelectedUserId: (name: string | null) => void;

  selectedUserName: string | null;
  setSelectedUserName: (name: string | null) => void;

  selectedUserPhone: string | null;
  setSelectedUserPhone: (name: string | null) => void;

  selectedUserRole: string | null;
  setSelectedUserRole: (name: string | null) => void;

  userFullName: string | null;
  setUserFullName: (name: string | null) => void;
  clearUserFullName: () => void;

  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  clearUserEmail: () => void;

  help: boolean;  
  setHelp: (value: boolean) => void;  

  addMember: boolean;
  setAddMember: (value : boolean ) => void;

  updateMember: boolean;
  setUpdateMember: (value : boolean ) => void;

  deleteRanch: boolean;
  setDeleteRanch: (value : boolean ) => void;

  viewMember: boolean;
  setViewMember: (value : boolean ) => void;

  updateRanch: boolean;
  setUpdateRanch: (value : boolean ) => void;

  ranchName: string | null;
  setRanchName: (name: string | null) => void;

  ranchDescription: string | null;
  setRanchDescription: (description: string | null) => void;


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
  const [addMember, setAddMember] = useState<boolean>(false);  
  const [updateMember, setUpdateMember] = useState<boolean>(false);  
  const [deleteRanch, setDeleteRanch] = useState<boolean>(false);
  const [viewMember, setViewMember] = useState<boolean>(false);
  const [updateRanch, setUpdateRanch] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null); 
  const [selectedUserName, setSelectedUserName] = useState<string | null>(null); 
  const [selectedUserPhone, setSelectedUserPhone] = useState<string | null>(null); 
  const [selectedUserRole, setSelectedUserRole] = useState<string | null>(null); 
  const [ranchName, setRanchName] = useState<string | null>(null); 
  const [ranchDescription, setRanchDescription] = useState<string | null>(null); 

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
      //Loged User
      userId, setUserId, clearUserId, 
      userFullName, setUserFullName, clearUserFullName,
      userEmail, setUserEmail, clearUserEmail,
      //Handle view
      help, setHelp,
      addMember, setAddMember, 
      updateMember,setUpdateMember,
      viewMember, setViewMember,
      updateRanch, setUpdateRanch,
      deleteRanch, setDeleteRanch,
      //Selected User
      selectedUserId, setSelectedUserId,
      selectedUserName, setSelectedUserName,
      selectedUserPhone, setSelectedUserPhone, 
      selectedUserRole, setSelectedUserRole,
      //Ranch Info
      ranchName, setRanchName, 
      ranchDescription, setRanchDescription
      }}>
      {children}
    </OrganizationContext.Provider>
  );
};
