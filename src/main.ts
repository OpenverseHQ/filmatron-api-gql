import { NestFactory, Reflector } from '@nestjs/core'
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { APILogger } from './config/logger'
import { checkAllValueENVHadPass, config } from './config'
import { ALLOWED_DOMAINS, isDevelopment } from './utils'

async function bootstrap() {
  try {
    const {
      domain,
      port,
      admin: { publicKey, secretKey }
    } = config

    const app = await NestFactory.create(AppModule, {
      logger: new APILogger()
    })
    app.enableCors({
      origin: ALLOWED_DOMAINS, // Replace with your frontend URL
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Enable credentials if your frontend sends cookies or credentials
    });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

    // check env
    checkAllValueENVHadPass([
      { name: 'admin-secret-key', value: config.admin.secretKey },
      { name: 'admin-publicKey-key', value: config.admin.publicKey },
      { name: 'rpc-url', value: config.rpcUrl }
    ])

    await app.listen(port)

    isDevelopment
      ? (Logger.log(`🤬  Application is running on: ${await app.getUrl()}`, 'NestJS', false),
        Logger.log(`🚀  Server ready at http://${domain}:${port}`, 'Bootstrap', false),
        Logger.log(`##########################################################`, 'Bootstrap', false),
        Logger.warn(`🚀  Server http://${domain}:${port}/graphql`, 'Bootstrap', false),
        Logger.warn(`🚀  Server playground http://${domain}:${port}/graphql/playground`, 'Bootstrap', false),
        Logger.log(`##########################################################`, 'Bootstrap', false))
      : Logger.log(`🚀  Server is listening on port ${port}`, 'Bootstrap', false)
  } catch (error) {
    Logger.error(`❌  Error starting server, ${error}`, '', 'Bootstrap', false)
    process.exit()
  }
}
bootstrap()
