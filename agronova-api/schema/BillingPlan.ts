import { allowAll } from '@keystone-6/core/access';
import { text, float, relationship } from '@keystone-6/core/fields';

export const BillingPlan = {
  access: allowAll,
  fields: {
    billing_plan_name: text({ validation: { isRequired: true } }),
    description: text({ validation: { isRequired: true } }),
    cost: float({ validation: { isRequired: true } }),
    user: relationship({ ref: 'User.billing_plan', many: false }),
    
  },
};
