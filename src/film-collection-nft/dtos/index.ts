import { FilmCollectionNFTEntity } from '@/db/entities/filmCollectionNFT'
import { Field, InputType, ObjectType, OmitType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@ObjectType({ isAbstract: true })
export class PublicInformationFilmCollectionNFT extends OmitType(FilmCollectionNFTEntity, [
  'masterEditionAccount',
  'metadataAccount',
  'mint',
  'tokenAccount',
  'treeKeypair'
]) {}

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
  filmId: number

  @Field(() => CollectionMetadataDto)
  @IsNotEmpty()
  metadata: CollectionMetadataDto
}
