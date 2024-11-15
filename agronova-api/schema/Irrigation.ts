import { allowAll } from '@keystone-6/core/access';
import { integer, relationship, timestamp, checkbox } from '@keystone-6/core/fields';

export const irrigation = {
  access: allowAll,
  fields: {
    crop_id: relationship({
      ref: "Crop.irrigation", many: false
    }),
    start_time: timestamp({
      validation: { isRequired: true },
      defaultValue: { kind: 'now' },
    }),
    end_time: timestamp({
      validation: { isRequired: true },
      defaultValue: { kind: 'now' },
    }),
    scheduled: checkbox({ defaultValue: false, label: 'Scheduled' }),
  },
};