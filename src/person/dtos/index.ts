import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType({ isAbstract: true })
export class UpdateInformationDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  publicKey?: string | null

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar?: string | null

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  background?: string | null

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string | null

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string | null
}
