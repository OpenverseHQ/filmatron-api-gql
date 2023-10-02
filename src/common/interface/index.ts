import { Type } from '@nestjs/common'
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export interface MyContext {
  req: {
    headers: {
      authorization: string
    }
  }
}

@ObjectType({ isAbstract: true })
export class PageInfo {
  @Field({ nullable: true })
  startCursor?: string | null

  @Field({ nullable: true })
  endCursor?: string | null

  @Field()
  hasPreviousPage: boolean

  @Field()
  hasNextPage: boolean
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  first?: number | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  after?: string | null

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  last?: number | null

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  before?: string | null
}

export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}Edge`, { isAbstract: true })
  abstract class EdgeType {
    @Field()
    cursor: string

    @Field(() => classRef)
    node: T
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [EdgeType], { nullable: true })
    edges?: EdgeType[] | null

    @Field(() => PageInfo, { nullable: true })
    pageInfo?: PageInfo | null
  }

  return PaginatedType
}
