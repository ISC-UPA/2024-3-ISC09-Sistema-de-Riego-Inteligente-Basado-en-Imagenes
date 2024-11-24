import { allowAll } from '@keystone-6/core/access';
import { text, relationship, checkbox } from '@keystone-6/core/fields';

export const ranch = {
  access: allowAll,
  fields: {
    ranch_name: text({ validation: { isRequired: true } }),
    description: text({ validation: { isRequired: true } }),
    user: relationship({ ref: 'User.ranch_id', many: true }),
    crop: relationship({ ref: 'Crop.ranch_id', many: true }),
    isDeleted: checkbox({
      defaultValue: false, 
      label: 'Está eliminado (soft delete)',
    }),
  },
};
