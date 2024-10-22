import { type Lists } from '.keystone/types';
import { azureADIntegration } from './AzureADIntegration';
import { user } from './User';
import { irrigation } from './irrigations';
import { life_cicle } from './life_cicle';
import { sickness } from './sickness';
import { treatments } from './treatments';



export const lists = {
  AzureADIntegration: azureADIntegration,
  User: user,
  Irrigation : irrigation,
  LifeCicle : life_cicle,
  Sick : sickness,
  Treatment: treatments


} satisfies Lists