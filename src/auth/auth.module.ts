import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthResolver } from './auth.resolver'
import { AuthService } from './auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PersonEntity } from 'src/db/entities/person'
import { AccessTokenStrategy } from 'src/providers/strategies/accessToken.strategy'
import { RefreshTokenStrategy } from 'src/providers/strategies/refreshToken.strategy'
import { PersonModule } from 'src/person/person.module'
import { RoleEntity } from '@/db/entities/role'

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([PersonEntity, RoleEntity]), PersonModule],
  providers: [AuthResolver, AuthService, AccessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule {}
