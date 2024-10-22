import { allowAll } from '@keystone-6/core/access';
import { text, select, decimal, relationship, float } from '@keystone-6/core/fields';

export const crops = {
  access: allowAll,
  fields: {
    crop_name: text({ validation: { isRequired: true } }),
    temperature: float(),
    humidity: float(),
    ph: float(),
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