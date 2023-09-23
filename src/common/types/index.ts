import { Field, ObjectType } from '@nestjs/graphql'

export type JWTPayload = {
  sub: string
  email: string
}

@ObjectType({ isAbstract: true })
export class FilmTopCast {
  @Field()
  name: string

  @Field()
  avatar: string
}

export interface TokenPayload {
  iat: number
  aud: string
  nonce: string
  iss: string
  wallets: {
    public_key: string
    type: string
    curve: string
  }[]
  email?: string
  name?: string
  profileImage?: string
  verifier: string
  verifierId: string
  aggregateVerifier: string
  exp: number
}
