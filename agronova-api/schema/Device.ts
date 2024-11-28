import { allowAll } from '@keystone-6/core/access';
import { text, relationship, select, checkbox, timestamp } from '@keystone-6/core/fields';

export const Device = {
  access: allowAll,
  fields: {
    device_name: text({ validation: { isRequired: false }, label: 'Nombre del dispositivo' }),
    serial_number: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
      label: 'Número de serie',
    }),
    status: select({
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Maintenance', value: 'maintenance' },
      ],
      defaultValue: 'active',
      label: 'Estado del dispositivo',
    }),
    iot_hub_connection_string: text({
      validation: { isRequired: false },
      label: 'Cadena de conexión IoT Hub',
    }),
    crop_id: relationship({ ref: 'Crop.device', many: false }),
    firmware_version: text({
      label: 'Versión del firmware',
      validation: { isRequired: false },
    }),
    last_communication: timestamp({
      label: 'Última comunicación con IoT Hub',
    }),
    is_deleted: checkbox({
      defaultValue: false,
      label: 'Está eliminado (soft delete)',
    }),
  },
};
