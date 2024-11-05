import { allowAll } from '@keystone-6/core/access';
import { text, select, checkbox, relationship } from '@keystone-6/core/fields';


export const permission = {
    access: allowAll,
    fields: {
        permission_name: text({ isIndexed: 'unique',validation: { isRequired: true }}),
        description: text({ validation: { isRequired: true } }),
        roles : relationship({ref: 'Role.permissions', many : true})
    }
}