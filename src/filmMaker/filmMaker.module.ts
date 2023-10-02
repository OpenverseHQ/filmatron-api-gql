import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilmMakerResolver } from './filmMaker.resolver'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'
import { PersonModule } from 'src/person/person.module'
import { NFTModule } from '@/nft/nft.module'
import { FilmCollectionNFTEntity } from '@/db/entities/filmCollectionNFT'
import { FilmCompressedNFTEntity } from '@/db/entities/filmCompressedNFT'

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonEntity, FilmCollectionNFTEntity, FilmCompressedNFTEntity]),
    PersonModule,
    NFTModule
  ],
  providers: [FilmMakerResolver, FilmMakerService],
  exports: [FilmMakerService]
})
export class FilmMakerModule {}
