import { allowAll } from '@keystone-6/core/access';
import { integer, relationship, timestamp, checkbox} from '@keystone-6/core/fields';

export const irrigation = {
  access: allowAll,
  fields: {
    crop_id: relationship({ 
        ref:"Crop", many:false
    }),
    start_time: timestamp({ 
        validation: { isRequired: true  },
        defaultValue: {kind: 'now'},
    }),
    duration_minutes: integer({
        validation:{isRequired: true, min: 0 },
        defaultValue: 0,
    }),
    scheduled: checkbox({ defaultValue: false, label: 'Scheduled' }),  
  },
};