import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { PublicKey } from '@solana/web3.js'
import { IsNotEmpty } from 'class-validator'

export type JWTPayload = {
  sub: string
  email: string
}

@ObjectType({ isAbstract: true })
@InputType({ isAbstract: true })
export class FilmTopCast {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  avatar: string
}

export class CollectionData {
  mint: PublicKey
  tokenAccount: PublicKey
  metadataAccount: PublicKey
  masterEditionAccount: PublicKey
}
