import { allowAll } from '@keystone-6/core/access';
import { text, calendarDay, select, checkbox, integer, timestamp } from '@keystone-6/core/fields';

export const sickness = {
  access: allowAll,
  fields: {
    id_sickness: integer({ 
        validation: { isRequired: true } 
    }),
    name: text({ 
        validation: { isRequired: true } 
    }),    
    detection_date: calendarDay({ 
      validation: { isRequired: true } 
  }),
  },
};