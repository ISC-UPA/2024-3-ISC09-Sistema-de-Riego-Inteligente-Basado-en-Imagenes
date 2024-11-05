import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox, relationship } from '@keystone-6/core/fields';


export const role = {
    access: allowAll,
    fields: {
        role_name: text({ isIndexed: 'unique',validation: { isRequired: true }}),
        description: text({ validation: { isRequired: true } }),
        permissions: relationship({ref: 'Permission.roles', many: true})
    }
}