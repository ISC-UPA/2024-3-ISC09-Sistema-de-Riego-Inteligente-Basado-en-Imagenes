import { allowAll } from '@keystone-6/core/access';
import { text, relationship } from '@keystone-6/core/fields';


export const ranch = {
    access: allowAll,
    fields: {
        ranch_name: text({ validation: { isRequired: true } }),
        description: text({ validation: { isRequired: true } }),
        user: relationship({ref: 'User.ranch_id', many:true})
    }
}