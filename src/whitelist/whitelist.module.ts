import { PersonEntity } from '@/db/entities/person'
import { WhitelistEntity } from '@/db/entities/whitelist'
import { PersonModule } from '@/person/person.module'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WhitelistResolver } from './whitelist.resolver'
import { WhitelistService } from './whitelist.service'

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity, WhitelistEntity]), PersonModule],
  providers: [WhitelistResolver, WhitelistService],
  exports: [WhitelistService]
})
export class WhitelistModule {}
