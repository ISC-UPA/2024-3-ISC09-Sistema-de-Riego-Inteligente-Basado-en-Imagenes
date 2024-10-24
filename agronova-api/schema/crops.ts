import { allowAll } from '@keystone-6/core/access';
import { text, select, decimal, integer, relationship, float } from '@keystone-6/core/fields';

export const crops = {
  access: allowAll,
  fields: {
    crop_id: integer({ validation: { isRequired: true } }),
    crop_name: text({ validation: { isRequired: true } }),
    location: text({ validation: { isRequired: true } }),
    status: select({
        options: [
          { label: 'Healthy', value: 'healthy' },
          { label: 'Sick', value: 'sick' }
        ],
        defaultValue: 'healthy',
        ui: { displayMode: 'select' },
        validation: { isRequired: true }
      }),
    // life_cycle: relationship({ ref: 'LifeCycle.crops', many: false }),
    // sickness: relationship({ ref: 'Sickness.crops', many: false }),
    // treatment: relationship({ ref: 'Treatment.crops', many: false }),
  },
};