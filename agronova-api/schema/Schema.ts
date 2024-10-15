import { type Lists } from '.keystone/types';
import { azureADIntegration } from './AzureADIntegration';
import { user } from './User';

export const lists = {
  AzureADIntegration: azureADIntegration,
  User: user,
} satisfies Lists