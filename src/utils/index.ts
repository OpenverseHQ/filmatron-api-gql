import { APP_ENV } from 'src/common/constant'
import { config } from 'src/config'

export const isDevelopment = [APP_ENV.DEV].includes(config.api.nodeEnv)
