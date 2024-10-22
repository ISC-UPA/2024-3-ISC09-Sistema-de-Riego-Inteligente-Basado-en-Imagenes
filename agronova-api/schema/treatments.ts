import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox, integer, timestamp } from '@keystone-6/core/fields';

export const treatments = {
  access: allowAll,
  fields: {
    id_treatments: integer({ 
        validation: { isRequired: true } 
    }),
    name: text({ 
        validation: { isRequired: true } 
    }),    
  },
};