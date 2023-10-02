import { FilmEntity } from '@/db/entities/film'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getManager } from 'typeorm'
import { GetFilmCommand } from './commands/GetFilm.command'
import { plainToClass } from 'class-transformer'
import { CreateFilmDto, FilmInformationPublic, PaginatedFilm, PaginatedFilmGallery, UpsertGalleryFilmDto } from './dtos'
import { PaginationArgs } from '@/common/interface'
import { paginate } from '@/common/paginate'
import { PersonEntity } from '@/db/entities/person'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { ADMIN_PROCESS_STATUS, FILM_STATUS } from '@/common/constant'
import { FilmGalleryEntity } from '@/db/entities/filmGalery'
import { compactObject } from '@/utils'

@Injectable()
export class FilmService {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(FilmGalleryEntity)
    private readonly filmGalleryRepository: Repository<FilmGalleryEntity>
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

  async getGalleryOfFilm(params: {filmId: number, paginationArgs: PaginationArgs, person: PersonEntity}): Promise<PaginatedFilmGallery> {
    const { filmId, paginationArgs, person } = params
    // validate the current user have the permission to see via nft or not 
    
    await GetFilmCommand.getFilmById(filmId)

    const query = this.filmGalleryRepository
      .createQueryBuilder()
      .select()
      .where('FilmGalleryEntity.filmId = :filmId', { filmId })

    return paginate<FilmGalleryEntity>({ query, paginationArgs, defaultLimit: 10 })
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

  async upsertGalleryFilm(input: UpsertGalleryFilmDto, person: PersonEntity): Promise<ReturnMessageBase> {
    await GetFilmCommand.getByFilmIdAndPersonId(input.filmId, person.id)

    await getManager()
      .createQueryBuilder()
      .insert()
      .into(FilmGalleryEntity, ['id', 'name', 'url', 'filmId'])
      .values(compactObject(input))
      .orUpdate(['name', 'url'], ['id'], { skipUpdateIfNoValuesChanged: true })
      .execute()

    return {
      message: `Upsert gallery for film success`,
      success: true
    }
  }
}
