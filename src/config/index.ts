import * as dotenv from 'dotenv'
import { APP_ENV } from 'src/common/constant'

dotenv.config()

export const config = {
  CLOUDINARY: 'Cloudinary',
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
  rpcUrl: process.env.RPC_URL,
  admin: {
    // wallet address that admin will sign transaction when film maker action create a collection for their NFT collection
    publicKey: process.env.ADMIN_PUBLIC_KEY,
    secretKey: process.env.ADMIN_SECRET_KEY
  },
  kylan: {
    // TODO: update name service of Kylan
    url: process.env.KYLAN_URL || 'https://filmatron-client-a88cb9.kylan.so/api',
    accessToken: '/access_token',
    userInfo: '/user',
    solanaAddress: '/user/address/solana'
  }
}

export const checkAllValueENVHadPass = (envValues: Record<string, string>[]) => {
  envValues.forEach(({ name, value }) => {
    if (!value) {
      console.error(`${name} had not passed to env file, pls add and run again`)
      process.exit(0)
    }
  })
}
