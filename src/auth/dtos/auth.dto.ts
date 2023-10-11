import { ROLE } from '@/common/constant'
import { Field, InputType, ObjectType } from '@nestjs/graphql'
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
  @Field()
  @IsNotEmpty()
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
  @Field()
  address: string
}
