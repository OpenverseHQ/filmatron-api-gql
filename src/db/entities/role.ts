import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ROLE } from 'src/common/constant'

@Entity('role')
@ObjectType({ isAbstract: true })
export class RoleEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number

  @Field(() => ROLE)
  @Column()
  role: ROLE
}
