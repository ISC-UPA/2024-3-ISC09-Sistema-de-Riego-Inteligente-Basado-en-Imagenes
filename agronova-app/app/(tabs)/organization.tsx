import Organization  from '@/components/organization/OrganizationInfo';
import React, { useContext } from 'react';
import { OrganizationContext } from '@/components/context/OrganizationContext';
import AddMemberScreen from '@/components/organization/addMember';

export default function OrganizationScreen() {
  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }

  const {addMember} = organizationContext;

  if(addMember){
    return <AddMemberScreen/>
  } else {return (
    <Organization></Organization>
  );
  }
}
