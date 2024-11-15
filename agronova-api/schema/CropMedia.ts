import { allowAll } from '@keystone-6/core/access';
import { text, relationship } from '@keystone-6/core/fields';

export const CropMedia = {
  access: allowAll,
  fields: {
    crop_id: relationship({ ref: 'Crop.crop_media', many: false }),
    address: text({ validation: { isRequired: true } }),
  },
};
