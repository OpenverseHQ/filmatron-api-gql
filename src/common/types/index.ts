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
