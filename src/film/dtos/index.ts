import { ObjectType, OmitType, InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'
import { Paginated } from '@/common/interface'
import { FilmEntity } from '@/db/entities/film'
import { FILM_GENRE } from '@/common/constant'
import { FilmTopCast } from '@/common/types'

@ObjectType({ isAbstract: true })
export class FilmInformationPublic extends OmitType(FilmEntity, ['whiteList', 'gallery']) {}

@ObjectType({ isAbstract: true })
export class PaginatedFilm extends Paginated(FilmInformationPublic) {}

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
