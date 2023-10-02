import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ROLE } from 'src/common/constant'
import { PersonEntity } from './person'

@Entity('role')
@ObjectType({ isAbstract: true })
export class RoleEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field(() => ROLE)
  @Column()
  role: ROLE

  @OneToMany(() => PersonEntity, person => person.rolePerson)
  persons: PersonEntity[]
}
