import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { NFTModule } from '@/nft/nft.module'
import { UserResolver } from './user.resolver'
import { PersonModule } from '@/person/person.module'
import { WhitelistEntity } from '@/db/entities/whitelist'

@Module({
  imports: [TypeOrmModule.forFeature([WhitelistEntity]), NFTModule, PersonModule],
  providers: [UserResolver, UserService]
})
export class UserModule {}
