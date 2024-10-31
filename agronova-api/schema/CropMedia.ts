import { allowAll } from '@keystone-6/core/access';
import { text, relationship } from '@keystone-6/core/fields';

export const CropMedia = {
  access: allowAll,
  fields: {
    crop_id: relationship({ ref: 'Crop', many: false }),
    address: text({ validation: { isRequired: true } }),
  },
};
