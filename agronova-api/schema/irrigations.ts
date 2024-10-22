import { allowAll } from '@keystone-6/core/access';
import { integer, timestamp } from '@keystone-6/core/fields';

export const irrigation = {
  access: allowAll,
  fields: {
    id_irrigation: integer({ 
        validation: { isRequired: true } 
    }),
    crop_id: integer({ 
        validation: { isRequired: true } 
    }),
    date: timestamp({ 
        validation: { isRequired: true  },
        defaultValue: {kind: 'now'},
    }),
    duration: integer({
        validation:{isRequired: true, min: 0 },
        defaultValue: 0,
    }),
    
  },
};