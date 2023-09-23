import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsEmail, IsString, MaxLength, MinLength, IsNotEmpty } from 'class-validator'
import { PersonEntity } from 'src/db/entities/person'

@InputType({ isAbstract: true })
export class CreateAccountDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(6)
  password: string

  // @IsString()
  // @IsNotEmpty()
  role: string
}

@InputType({ isAbstract: true })
export class SignInDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @Field()
  @IsString()
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
