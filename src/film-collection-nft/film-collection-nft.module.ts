import { FilmCollectionNFTEntity } from '@/db/entities/filmCollectionNFT'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilmCollectionNFTResolver } from './film-collection-nft.resolver'
import { FilmCollectionNFTService } from './film-collection-nft.service'
import { PersonEntity } from '@/db/entities/person'
import { PersonModule } from '@/person/person.module'
import { NFTModule } from '@/nft/nft.module'

@Module({
  imports: [TypeOrmModule.forFeature([FilmCollectionNFTEntity, PersonEntity]), PersonModule, NFTModule],
  providers: [FilmCollectionNFTResolver, FilmCollectionNFTService],
  exports: [FilmCollectionNFTService]
})
export class FilmCollectionNFTModule {}
