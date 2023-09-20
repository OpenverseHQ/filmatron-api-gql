import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilmMakerResolver } from './filmMaker.resolver'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'
import { PersonModule } from 'src/person/person.module'

@Module({
  imports: [TypeOrmModule.forFeature([PersonEntity]), PersonModule],
  providers: [FilmMakerResolver, FilmMakerService],
  exports: [FilmMakerService]
})
export class FilmMakerModule {}
