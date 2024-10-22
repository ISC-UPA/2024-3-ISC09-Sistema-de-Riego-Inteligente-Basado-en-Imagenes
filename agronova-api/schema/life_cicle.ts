import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox, integer, timestamp } from '@keystone-6/core/fields';

export const life_cicle = {
  access: allowAll,
  fields: {
    id_life_cicle: integer({ 
        validation: { isRequired: true } 
    }),
    name: text({ 
        validation: { isRequired: true } 
    }),
    
  },
};