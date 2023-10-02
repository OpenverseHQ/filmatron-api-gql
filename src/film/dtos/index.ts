import { ObjectType, OmitType, InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { Paginated } from '@/common/interface'
import { FilmEntity } from '@/db/entities/film'
import { FILM_GENRE } from '@/common/constant'
import { FilmTopCast } from '@/common/types'
import { FilmGalleryEntity } from '@/db/entities/filmGalery'

@ObjectType({ isAbstract: true })
export class FilmInformationPublic extends OmitType(FilmEntity, ['whiteList']) {}

@ObjectType({ isAbstract: true })
export class PaginatedFilm extends Paginated(FilmInformationPublic) {}

@ObjectType({ isAbstract: true })
export class PaginatedFilmGallery extends Paginated(FilmGalleryEntity) {}

@InputType({ isAbstract: true })
export class CreateFilmDto {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  description: string

  @Field(() => Int)
  @IsNotEmpty()
  duration: number

  @Field()
  @IsNotEmpty()
  releaseDate: string

  @Field(() => [FILM_GENRE], { defaultValue: [] })
  @IsNotEmpty()
  genres: FILM_GENRE[]

  @Field(() => [String], { defaultValue: [] })
  @IsNotEmpty()
  stars: string[]

  @Field(() => [String], { defaultValue: [] })
  @IsNotEmpty()
  directors: string[]

  @Field(() => [FilmTopCast], { defaultValue: [] })
  @IsNotEmpty()
  topCasts: FilmTopCast[]

  @Field(() => GraphQLISODateTime)
  @IsNotEmpty()
  endDateSubscriber: Date
}

@InputType({ isAbstract: true })
export class UpsertGalleryFilmDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  id?: number | null

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  url: string

  @Field()
  @IsNotEmpty()
  @IsNumber()
  filmId: number
}