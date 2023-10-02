import { FilmEntity } from '@/db/entities/film'
import { FilmEventEntity } from '@/db/entities/filmEvent'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FilmResolver } from './film.resolver'
import { FilmService } from './film.service'
import { PersonEntity } from '@/db/entities/person'
import { PersonModule } from '@/person/person.module'

@Module({
  imports: [TypeOrmModule.forFeature([FilmEntity, FilmEventEntity, PersonEntity]), PersonModule],
  providers: [FilmResolver, FilmService],
  exports: [FilmService]
})
export class FilmModule {}
