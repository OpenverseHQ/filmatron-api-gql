import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './user.service'
import { NFTModule } from '@/nft/nft.module'
import { UserResolver } from './user.resolver'
import { PersonModule } from '@/person/person.module'

@Module({
  imports: [TypeOrmModule.forFeature([]), NFTModule, PersonModule],
  providers: [UserResolver, UserService]
})
export class UserModule {}
