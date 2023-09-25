import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilmMakerResolver } from './filmMaker.resolver'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'
import { PersonModule } from 'src/person/person.module'
import { NFTModule } from '@/nft/nft.module'
import { FilmCollectionNFT } from '@/db/entities/filmCollectionNFT'
import { FilmEntity } from '@/db/entities/film'

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity, FilmCollectionNFT, FilmEntity]), PersonModule, NFTModule],
  providers: [FilmMakerResolver, FilmMakerService],
  exports: [FilmMakerService]
})
export class FilmMakerModule {}
