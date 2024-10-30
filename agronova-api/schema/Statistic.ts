import { allowAll } from '@keystone-6/core/access';
import { calendarDay, float,relationship } from '@keystone-6/core/fields';

export const statistic ={
    access: allowAll,
    fields: {
        crop_id: relationship({ ref:"Crop", many:false}),
        timestamp: calendarDay({ validation: { isRequired: true } }),
        soil_moisture: float({ validation: { isRequired: true } }),
        air_humidity: float({ validation: { isRequired: true } }),
        air_temperature: float({ validation: { isRequired: true } }),
    }
}