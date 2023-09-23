import { Connection, ConnectionManager, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import * as dotenv from 'dotenv'
import { configData } from './ormconfig'

export class ConnectToDb {
  private connectionManager: ConnectionManager

  constructor() {
    this.connectionManager = getConnectionManager()
  }

  public async getConnection(connectionName = 'default', nodeEnv?: string): Promise<Connection> {
    let connection: Connection
    try {
      if (this.connectionManager.has(connectionName)) {
        console.log(`>>> Connection Manager has "${connectionName}" connection. Reusing...`)
        connection = this.connectionManager.get(connectionName)
        if (!connection.isConnected) {
          console.log(`>>> The "${connectionName}" connection has been stopped. Reconnecting...`)
          connection = await connection.connect()
        }
      } else {
        console.log(`>>> The "${connectionName}" connection doesn't exist. Creating...`)
        connection = await createConnection(configData)
      }

      return connection
    } catch (error) {
      console.error(`>>> ERROR occurs while getting the "${connectionName}" connection`, error)
      throw error
    }
  }
}
