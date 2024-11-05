import { allowAll } from '@keystone-6/core/access';
import { text, relationship } from '@keystone-6/core/fields';

export const crop = {
  access: allowAll,
  fields: {
    user_id: relationship({ref:'User', many:false}),
    crop_name: text({ validation: { isRequired: true } }),
    location: text({ validation: { isRequired: true } }),

  },
};