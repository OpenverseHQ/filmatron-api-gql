import { Resolver, Query, ID, Args, Mutation } from '@nestjs/graphql'
import { FilmService } from './film.service'
import { CreateFilmDto, FilmInformationPublic, PaginatedFilm, PaginatedFilmGallery, UpsertGalleryFilmDto } from './dtos'
import { PaginationArgs } from '@/common/interface'
import { AuthKylan } from 'src/common/decorators/auth.decorator'
import { ROLE } from '@/common/constant'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { Person } from '@/common/decorators/person.decorator'
import { PersonEntity } from '@/db/entities/person'
import { FilmGalleryEntity } from '@/db/entities/filmGalery'

@Resolver()
export class FilmResolver {
  constructor(private readonly filmService: FilmService) {}

  @Query(() => FilmInformationPublic, { name: 'getFilmById' })
  async geById(@Args('id', { type: () => ID }) id: number): Promise<FilmInformationPublic> {
    return this.filmService.geById(id)
  }

  @Query(() => PaginatedFilm, { name: 'getFilms' })
  async getFilms(@Args() paginationArgs: PaginationArgs): Promise<PaginatedFilm> {
    return this.filmService.getFilms(paginationArgs)
  }

  @AuthKylan([ROLE.FILMMAKER, ROLE.USER])
  @Query(() => PaginatedFilmGallery, { name: 'getGalleriesOfFilm' })
  async getGalleriesOfFilm(
    @Args('filmId', { type: () => ID }) filmId: number,
    @Args() paginationArgs: PaginationArgs,
    @Person() person: PersonEntity
  ): Promise<PaginatedFilmGallery> {
    return await this.filmService.getGalleriesOfFilm({ filmId, paginationArgs, person })
  }

  @AuthKylan([ROLE.FILMMAKER, ROLE.USER])
  @Query(() => FilmGalleryEntity, { name: 'getGalleryById' })
  async getGalleryById(@Args('id', { type: () => ID }) id: number, @Person() person: PersonEntity): Promise<FilmGalleryEntity> {
    return await this.filmService.getGalleryById(id, person)
  }

  @AuthKylan([ROLE.FILMMAKER])
  @Mutation(() => ReturnMessageBase, { name: 'createFilm' })
  async createFilm(@Args('input') input: CreateFilmDto, @Person() person: PersonEntity): Promise<ReturnMessageBase> {
    return await this.filmService.createFilm(input, person)
  }

  @AuthKylan([ROLE.FILMMAKER])
  @Mutation(() => ReturnMessageBase, { name: 'upsertGalleryFilm' })
  async upsertGalleryFilm(
    @Args('input') input: UpsertGalleryFilmDto,
    @Person() person: PersonEntity
  ): Promise<ReturnMessageBase> {
    return await this.filmService.upsertGalleryFilm(input, person)
  }
}
