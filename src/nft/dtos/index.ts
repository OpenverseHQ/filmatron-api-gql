import { InputType, Field, ID, ObjectType } from '@nestjs/graphql'
import { FilmCompressedNFTEntity } from '@/db/entities/filmCompressedNFT'
import { Paginated } from '@/common/interface'
import { IsNotEmpty } from 'class-validator'

@InputType({ isAbstract: true })
export class CreateCompressedNFTMetadata {
  @Field(() => ID)
  @IsNotEmpty()
  filmId: number

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
export class CompressedNFTMetadata {
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

@ObjectType({ isAbstract: true })
export class PaginatedCompressedNFT extends Paginated(FilmCompressedNFTEntity) {}
