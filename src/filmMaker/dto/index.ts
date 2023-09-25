import { FILM_GENRE, FILM_STATUS } from '@/common/constant'
import { FilmTopCast } from '@/common/types'
import { Field, InputType, Int } from '@nestjs/graphql'
import { IsEnum, IsNotEmpty } from 'class-validator'

@InputType({ isAbstract: true })
export class CollectionMetadataDto {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  symbol: string

  @Field()
  @IsNotEmpty()
  uri: string
}

@InputType({ isAbstract: true })
export class CreateCollectionNFTDto {
  @Field()
  @IsNotEmpty()
  id: number

  @Field(() => CollectionMetadataDto)
  @IsNotEmpty()
  metadata: CollectionMetadataDto
}

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

  @Field(() => FILM_STATUS)
  @IsNotEmpty()
  @IsEnum(FILM_STATUS)
  status: FILM_STATUS

  @Field(() => [FilmTopCast], { defaultValue: [] })
  @IsNotEmpty()
  topCasts: FilmTopCast[]

  @Field(() => [String], { defaultValue: [] })
  @IsNotEmpty()
  gallery: string[]
}
