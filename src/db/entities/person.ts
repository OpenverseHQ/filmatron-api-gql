import { Field, ID, ObjectType } from '@nestjs/graphql'
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Entity,
  OneToMany,
  ManyToOne
} from 'typeorm'

import * as bcrypt from 'bcrypt'
import { RoleEntity } from './role'
import { FilmEntity } from './film'

@Entity('person')
@ObjectType({ isAbstract: true })
export class PersonEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  publicKey: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  email: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  password: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  avatar: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  background: string | null

  @Field()
  @Column()
  name: string

  // TODO: Pending for design
  // @Column()
  // followers: number

  // @Column()
  // following: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  bio: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  discord: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  youtube: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  twitter: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  instagram: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken: string | null

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date

  @ManyToOne(() => RoleEntity, role => role.persons)
  rolePerson: RoleEntity

  @OneToMany(() => FilmEntity, film => film.person, { nullable: true })
  films: FilmEntity[]

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password)
  }
}
