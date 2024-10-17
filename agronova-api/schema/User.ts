import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox } from '@keystone-6/core/fields';

export const user = {
  access: allowAll,
  fields: {
    fullName: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true } }),
    phoneNumber: text({ validation: { isRequired: true } }),
    userRole: select({
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Resident', value: 'resident' },
        { label: 'Security', value: 'security' },
        { label: 'Guest', value: 'guest' },
      ],
      defaultValue: 'resident',
    }),
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