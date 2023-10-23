import { ROLE } from '@/common/constant'
import { Field, Float, GraphQLISODateTime, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator'
import { PersonEntity } from 'src/db/entities/person'

@InputType({ isAbstract: true })
export class CreateAccountDto {
  @Field()
  @IsNotEmpty()
  name: string

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Field()
  @MaxLength(50)
  @MinLength(6)
  password: string

  @Field(() => ROLE)
  @IsEnum(ROLE)
  role: ROLE
}

@InputType({ isAbstract: true })
export class SignInWithSocialDto {
  @Field({ nullable: true })
  publicKey: string

  @Field(() => ROLE)
  @IsEnum(ROLE)
  role: ROLE
}

@InputType({ isAbstract: true })
export class SignInDto {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Field()
  @IsNotEmpty()
  password: string
}

@ObjectType({ isAbstract: true })
export class ReturnTokenDto {
  @Field()
  accessToken: string

  @Field()
  refreshToken: string
}

@ObjectType({ isAbstract: true })
export class ReturnAccountDto extends ReturnTokenDto {
  @Field()
  person: PersonEntity
}

@ObjectType({ isAbstract: true })
export class ReturnSolanaAddressDto {
  @Field({ nullable: true })
  address: string
}

@ObjectType({ isAbstract: true })
export class ReturnSignInWalletInput {
  @Field()
  domain: string

  @Field()
  statement: string

  @Field()
  version: string

  @Field()
  chainId: string

  @Field()
  nonce: string

  @Field()
  issuedAt: string

  @Field(() => [String])
  resources: string[]
}


@InputType({ isAbstract: true })
export class VerifySignInWithWalletDto {
  @Field()
  constructPayload: string
}