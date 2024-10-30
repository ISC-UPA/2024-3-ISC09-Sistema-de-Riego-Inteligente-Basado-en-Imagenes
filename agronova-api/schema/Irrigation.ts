import { allowAll } from '@keystone-6/core/access';
import { integer, relationship, timestamp } from '@keystone-6/core/fields';

export const irrigation = {
  access: allowAll,
  fields: {
    crop_id: relationship({ 
        ref:"Crop", many:false
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