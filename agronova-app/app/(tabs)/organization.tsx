import Organization  from '@/components/organization/OrganizationInfo';
import React, { useContext } from 'react';
import { OrganizationContext } from '@/components/context/OrganizationContext';
import AddMemberScreen from '@/components/organization/addMember';
import DeleteConfirmationModal from '@/components/widgets/ConfirmModal';

export default function OrganizationScreen() {
  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }

  const {addMember, updateMember, deleteRanch} = organizationContext;

  if(addMember || updateMember){
    return <AddMemberScreen/>
  }else if(deleteRanch){
    /*Poner el componente para eliminar un rancho*/
  } else {return (
    <Organization></Organization>
  );
  }
}
