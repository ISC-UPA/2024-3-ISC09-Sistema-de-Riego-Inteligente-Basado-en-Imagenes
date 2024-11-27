import { allowAll } from '@keystone-6/core/access';
import { text, relationship, checkbox, float } from '@keystone-6/core/fields';

export const crop = {
  access: allowAll,
  fields: {
    crop_name: text({ validation: { isRequired: true } }),
    location: text({ validation: { isRequired: true } }),
    latitude: float({
      label: 'Latitud',
    }),
    longitude: float({
      label: 'Longitud',
    }),
    users: relationship({ ref: 'User.crops', many: true }),
    ranch_id: relationship({ ref: 'Ranch.crop', many: false }),
    statistic: relationship({ ref: 'Statistic.crop_id', many: true }),
    irrigation: relationship({ ref: 'Irrigation.crop_id', many: true }),
    crop_media: relationship({ ref: 'CropMedia.crop_id', many: true }),
    device: relationship({ ref: 'Device.crop_id', many: false }),
    isDeleted: checkbox({
      defaultValue: false,
      label: 'Está eliminado (soft delete)',
    }),
  },
};
