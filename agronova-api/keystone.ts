import { config } from '@keystone-6/core'
import { lists } from './schema/Schema'
import { envconfig } from './lib/envconfig';
import cors from 'cors'

export default config({
  db: {
    provider: 'sqlite',
    url: 'file:./db/agronova.db',
  },
  server: {
    cors: {
      origin: true,
      credentials: true,
    },
    port: envconfig.KEYSTONE_PORT || 3000,
    extendExpressApp: (app) => {
      app.use(cors({
        origin: true,
        credentials: true,
      }));
    },
  },
  lists,
});