import { allowAll } from '@keystone-6/core/access';
import { timestamp, float,relationship } from '@keystone-6/core/fields';

export const statistic ={
    access: allowAll,
    fields: {
        crop_id: relationship({ ref:"Crop.statistic", many:false}),
        timestamp: timestamp({
            validation: { isRequired: true  },
            defaultValue: {kind: 'now'},
          }),
        soil_moisture: float(),
        air_humidity: float({ validation: { isRequired: true } }),
        air_temperature: float({ validation: { isRequired: true } }),
    }
}