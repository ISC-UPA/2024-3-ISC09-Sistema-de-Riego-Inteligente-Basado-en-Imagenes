import { OrganizationContext } from '@/components/context/OrganizationContext';
import HelpSupport from '@/components/help/HelpSupport';
import Organization  from '@/components/organization/OrganizationInfo';
import React, { useContext } from 'react';



export default function OrganizationScreen() {
  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext ) {
    throw new Error('HomeScreen debe ser utilizado dentro de un Provider');
  }
  
  const {help} = organizationContext;
  if(help){
    return <HelpSupport></HelpSupport>
  }
  return (
    <Organization></Organization>
  );
}
