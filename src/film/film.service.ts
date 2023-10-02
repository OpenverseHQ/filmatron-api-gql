import { FilmEntity } from '@/db/entities/film'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { GetFilmCommand } from './commands/GetFilm.command'
import { plainToClass } from 'class-transformer'
import { CreateFilmDto, FilmInformationPublic, PaginatedFilm } from './dtos'
import { PaginationArgs } from '@/common/interface'
import { paginate } from '@/common/paginate'
import { PersonEntity } from '@/db/entities/person'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { ADMIN_PROCESS_STATUS, FILM_STATUS } from '@/common/constant'

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>
  ) {}

  async geById(id: number): Promise<FilmInformationPublic> {
    return plainToClass(FilmEntity, await GetFilmCommand.getFilmById(id), {
      excludeExtraneousValues: true
    }) as FilmInformationPublic
  }

  async getFilms(paginationArgs: PaginationArgs): Promise<PaginatedFilm> {
    const query = this.filmRepository.createQueryBuilder().select()

    return paginate({ query, paginationArgs, isUsedPlainClass: true, classRef: FilmEntity, defaultLimit: 7 })
  }

  async createFilm(input: CreateFilmDto, person: PersonEntity): Promise<ReturnMessageBase> {
    // Minh-27-9-2023: we add admin status approved by default to skip the step approval by admin. This status need to update bu admin
    await this.filmRepository.save({
      ...input,
      person,
      status: FILM_STATUS.COMING_SOON,
      adminProcess: ADMIN_PROCESS_STATUS.APPROVED
    } as FilmEntity)

    return {
      message: `Create film success`,
      success: true
    }
  }
}
