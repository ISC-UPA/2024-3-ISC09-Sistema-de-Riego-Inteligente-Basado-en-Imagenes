import { type Lists } from '.keystone/types';
import { azureADIntegration } from './AzureADIntegration';
import { user } from './User';
import { irrigation } from './Irrigation';
import { crop } from './Crop'; 
import { statistic } from './Statistic';
import { BillingPlan } from './BillingPlan';
import { FeaturePlan } from './FeaturePlan'; 
import { CropMedia } from './CropMedia';


export const lists = {
  AzureADIntegration: azureADIntegration,
  User: user,
  Irrigation : irrigation,
  Crop: crop,
  Statistic: statistic,
  BillingPlan: BillingPlan,
  FeaturePlan: FeaturePlan,
  CropMedia: CropMedia

} satisfies Lists