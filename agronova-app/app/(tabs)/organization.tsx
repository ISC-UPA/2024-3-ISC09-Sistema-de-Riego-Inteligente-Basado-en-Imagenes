import Organization  from '@/components/organization/OrganizationInfo';
import React, { useContext } from 'react';
import { OrganizationContext } from '@/components/context/OrganizationContext';
import AddMemberScreen from '@/components/organization/addMember';
import MemberProfile from '@/components/organization/MemberProfile';
import CreateRanch from '../create-ranch';

export default function OrganizationScreen() {
  const organizationContext = useContext(OrganizationContext);

  if (!organizationContext) {
    throw new Error('organization context debe ser utilizado dentro de un OrganizationProvider');
  }

  const {addMember, updateMember, viewMember, updateRanch} = organizationContext;

  if(addMember || updateMember){
    return <AddMemberScreen/>
  }else if(viewMember){
    return <MemberProfile/>
  }else if(updateRanch){
    return <CreateRanch/>
  }
  else {return (
    <Organization></Organization>
  );
  }
}
