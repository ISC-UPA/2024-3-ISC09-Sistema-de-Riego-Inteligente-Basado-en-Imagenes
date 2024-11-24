import { type Lists } from '.keystone/types';
import { azureADIntegration } from './AzureADIntegration';
import { user } from './User';
import { irrigation } from './Irrigation';
import { crop } from './Crop'; 
import { statistic } from './Statistic';
import { BillingPlan } from './BillingPlan';
import { FeaturePlan } from './FeaturePlan'; 
import { CropMedia } from './CropMedia';
import { ranch } from './Ranch';
import { role } from './Role';
import { permission } from './Permission';
import { Device } from './Device';

export const lists = {
  AzureADIntegration: azureADIntegration,
  User: user,
  Irrigation : irrigation,
  Crop: crop,
  Statistic: statistic,
  BillingPlan: BillingPlan,
  FeaturePlan: FeaturePlan,
  CropMedia: CropMedia,
  Ranch: ranch,
  Role: role,
  Permission: permission,
  Device: Device
} satisfies Lists