import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox } from '@keystone-6/core/fields';

export const user = {
  access: allowAll,
  fields: {
    fullName: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true } }),
    phoneNumber: text({ validation: { isRequired: true } }),
    billing_plan_id: relationship({ ref: 'BillingPlan.users', many: false }),
    crops: relationship({ ref: 'Crop.user_id', many: true }),
   
    profilePicture: text(),
    accountStatus: select({
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
      defaultValue: 'active',
    }),
    adAuthenticationStatus: checkbox(),
  },
};