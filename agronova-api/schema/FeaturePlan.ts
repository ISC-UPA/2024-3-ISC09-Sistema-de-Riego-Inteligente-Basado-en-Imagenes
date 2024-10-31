import { allowAll } from '@keystone-6/core/access';
import { text, relationship } from '@keystone-6/core/fields';

export const FeaturePlan = {
  access: allowAll,
  fields: {
    billing_plan_id: relationship({ ref: 'BillingPlan', many: false }),
    feature: text({ validation: { isRequired: true } }),
  },
};
