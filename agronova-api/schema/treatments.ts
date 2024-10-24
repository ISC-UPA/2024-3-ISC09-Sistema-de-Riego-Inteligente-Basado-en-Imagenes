import { allowAll } from '@keystone-6/core/access';
import { text, calendarDay, select, checkbox, integer, timestamp } from '@keystone-6/core/fields';

export const treatments = {
  access: allowAll,
  fields: {
    id_treatments: integer({ 
        validation: { isRequired: true } 
    }),
    id_sickness: integer({ 
      validation: { isRequired: true } 
  }),
    name: text({ 
        validation: { isRequired: true } 
    }),   
    application_date: calendarDay(),
    notes: text() 
  },

};