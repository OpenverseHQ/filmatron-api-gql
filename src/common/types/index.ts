import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { PublicKey } from '@solana/web3.js'

export type JWTPayload = {
  sub: string
  email: string
}

export type JWTKylanPayload = {
  domain: string
  pubkey: string
  code: string
  iat: number
  ttl: number
  permissions: string[]
}

@ObjectType({ isAbstract: true })
@InputType('FilmTopCastInput', { isAbstract: true })
export class FilmTopCast {
  @Field()
  name: string

  @Field({nullable: true})
  avatar: string
}

export interface TokenPayload {
  domain: string
  pubkey: string
  code: string
  iat: number
  jti: string
  ttl: number
  permissions: string[]
}

export class CollectionData {
  mint: PublicKey
  tokenAccount: PublicKey
  metadataAccount: PublicKey
  masterEditionAccount: PublicKey
}

export class CollectionInformation extends CollectionData {
  treeKeypair: PublicKey
}

export enum ORDER_BY {
  ASC = 'ASC',
  DESC = 'DESC'
}
