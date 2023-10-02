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
  domain: string
  pubkey: string
  code: string
  iat: number
  ttl: number
  permissions: string[]
}
