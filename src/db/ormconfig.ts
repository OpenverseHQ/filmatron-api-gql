import { ConnectionOptions } from 'typeorm'
import { config } from '../config'

const { databaseName, databaseDev, password, port, user } = config.db

export const configData = {
  type: 'postgres',
  host: databaseDev,
  port: parseInt(port as string),
  username: user,
  password,
  database: databaseName,
  // After development turn off this synchronization
  synchronize: true,
  logging: true,
  entities: ['dist/db/entities/*{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  cli: {
    migrationsDir: '/migrations'
  }
} as ConnectionOptions

// export default new DataSource(configData)
