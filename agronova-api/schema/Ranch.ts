import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox, relationship } from '@keystone-6/core/fields';


export const ranch = {
    access: allowAll,
    fields: {
        ranch_name: text({ validation: { isRequired: true } }),
        description: text({ validation: { isRequired: true } }),
    }
}