import * as dotenv from 'dotenv'
import { APP_ENV } from 'src/common/constant'
import { CLUSTER } from '@/common/constant'

dotenv.config()



export const config = {
  api: {
    nodeEnv: process.env.APP_ENV || APP_ENV.DEV
  },
  domain: process.env.APP_HOST || 'localhost',
  port: process.env.APP_PORT || 3000,
  db: {
    databaseDev: process.env.DB_HOST_DEV || 'localhost',
    databasePro: process.env.DB_HOST_PRO,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'Minh0914121791',
    databaseName: process.env.DB_NAME || 'postgres'
  },
  bcrypt: {
    salt: 10
  },
  secrets: {
    accessToken: process.env.JWT_ACCESS_TOKEN,
    refreshToken: process.env.JWT_REFRESH_TOKEN
  },
  rpcUrl: CLUSTER.DEV_NET,
  admin: {
    // wallet address that admin will sign transaction when film maker action create a collection for their NFT collection
    publickKey: process.env.ADMIN_PUBLICK_KEY || '89Fh4QKhCEJ5rC1Bf4utchfmqPNejYTfjoW6VxDL8YqB',
    secretKey: process.env.ADMIN_SECRET_KEY
  }
}
