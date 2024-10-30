import { type Lists } from '.keystone/types';
import { azureADIntegration } from './AzureADIntegration';
import { user } from './User';
import { irrigation } from './Irrigation';
import { crop } from './Crop'; 
import { statistic } from './Statistic';


export const lists = {
  AzureADIntegration: azureADIntegration,
  User: user,
  Irrigation : irrigation,
  Crop: crop,
  Statistic: statistic

} satisfies Lists