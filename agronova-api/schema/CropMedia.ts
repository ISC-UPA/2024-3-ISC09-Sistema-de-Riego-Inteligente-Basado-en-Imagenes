import { allowAll } from '@keystone-6/core/access';
import { text, relationship, select } from '@keystone-6/core/fields';

export const CropMedia = {
  access: allowAll,
  fields: {
    crop_id: relationship({ ref: 'Crop.crop_media', many: false }),
    address: text({ validation: { isRequired: true } }),
    media_type: select({
      options: [
        { label: 'Photo', value: 'photo' },
        { label: 'Video', value: 'video' },
      ],
      defaultValue: 'photo',
      ui: {
        displayMode: 'segmented-control', // Opcional para mejor visualización en el panel de administración
      },
      validation: { isRequired: true },
    }),
  },
};
