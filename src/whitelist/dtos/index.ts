import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType({ isAbstract: true })
export class PublicInformationPerson {
  @Field(() => ID)
  id: number

  @Field({ nullable: true })
  publicKey?: string | null

  @Field({ nullable: true })
  email?: string | null

  @Field({ nullable: true })
  avatar?: string | null

  @Field({ nullable: true })
  background?: string | null

  @Field()
  name: string

  @Field({ nullable: true })
  bio?: string | null
}
