import { allowAll } from '@keystone-6/core/access';
import { text, select, integer, checkbox, calendarDay, float } from '@keystone-6/core/fields';

export const statistics ={
    access: allowAll,
    fields: {
        statistic_id: integer({ validation: { isRequired: true } }),
        crop_id: integer({validation: { isRequired: true } }),
        timestamp: calendarDay({ validation: { isRequired: true } }),
        soil_moisture: float({ validation: { isRequired: true } }),
        air_humidity: float({ validation: { isRequired: true } }),
        air_temperature: float({ validation: { isRequired: true } }),

    }
}