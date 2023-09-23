import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { FilmMakerModule } from './filmMaker/filmMaker.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as _ from 'lodash'
import { configData } from './db/ormconfig'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PersonModule } from './person/person.module'
import { RoleModule } from './role/role.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { join } from 'path'
import { NFTModule } from './nft/nft.module'
import { RestController } from './app.controller'

@Module({
  controllers: [RestController],
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: join(process.cwd(), `/schema.gql`),
      path: `/graphql`,
      formatError: (error: GraphQLError) => {
        const message = _.isArray(error.message) ? error.message : [error.message]

        const errorFormatted = {
          //@ts-ignore
          statusCode: error.extensions?.originalError?.statusCode || 500,
          //@ts-ignore
          message: error.extensions?.originalError?.message || message,
          //@ts-ignore
          messageCode: error.extensions?.code || error.message
        }

        return errorFormatted
      },
      include: [FilmMakerModule, AuthModule]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`
    }),
    FilmMakerModule,
    AuthModule,
    PersonModule,
    RoleModule,
    NFTModule,
    TypeOrmModule.forRoot(configData)
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor
    }
  ]
})
export class AppModule {}
