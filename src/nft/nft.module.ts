import { Module } from '@nestjs/common'
import { NFTService } from './nft.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilmCompressedNFTEntity } from '@/db/entities/filmCompressedNFT'
import { NFTResolver } from './nft.resolver'
import { PersonModule } from '@/person/person.module'

@Module({
  imports: [PersonModule, TypeOrmModule.forFeature([FilmCompressedNFTEntity])],
  providers: [NFTService, NFTResolver],
  exports: [NFTService]
})
export class NFTModule {}
