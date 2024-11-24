import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox, relationship } from '@keystone-6/core/fields';

export const user = {
  access: allowAll,
  fields: {
    full_name: text({ validation: { isRequired: true } }),
    email: text(
      { 
        validation: { 
          isRequired: true,
          match: { regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, explanation: 'Must be a valid email address' } 
        },
        isIndexed: 'unique'
      }
    ),
    phone_number: text({ validation: { isRequired: true } }),
    billing_plan_id: relationship({ ref: 'BillingPlan.user', many: false }),
    ranch_id: relationship({ ref: 'Ranch.user', many: false }),
    role_id : relationship({ ref: 'Role.user', many: false }),
    crops: relationship({ref: 'Crop.users', many: true}),
    profile_picture: text(),
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