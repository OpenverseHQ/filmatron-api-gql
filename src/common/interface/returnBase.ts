import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ReturnMessageBase {
  @Field()
  success: boolean

  @Field()
  message: string
}
