import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { FILM_GENRE, ADMIN_PROCESS_STATUS, FILM_STATUS } from 'src/common/constant'
import { FilmTopCast } from 'src/common/types'
import { PersonEntity } from './person'
import { FilmEventEntity } from './filmEvent'
import { Exclude, Expose } from 'class-transformer'
import { FilmCompressedNFTEntity } from './filmCompressedNFT'

@Entity('film')
@ObjectType({ isAbstract: true })
export class FilmEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Field()
  @Column()
  @Expose()
  name: string

  @Field()
  @Column({ type: 'varchar', length: 10000 })
  @Expose()
  description: string

  @Field(() => Int)
  @Column()
  @Expose()
  duration: number

  @Field()
  @Column()
  @Expose()
  releaseDate: string

  @Field(() => [FILM_GENRE])
  @Column({ type: 'varchar', array: true })
  @Expose()
  genres: FILM_GENRE[]

  @Field(() => [String])
  @Column({ type: 'varchar', array: true })
  @Expose()
  stars: string[]

  @Field(() => [String])
  @Column({ type: 'varchar', array: true })
  @Expose()
  directors: string[]

  @Field(() => ADMIN_PROCESS_STATUS)
  @Column({ type: 'varchar' })
  @Expose()
  adminProcess: ADMIN_PROCESS_STATUS

  @Field(() => FILM_STATUS)
  @Column({ type: 'varchar' })
  @Expose()
  status: FILM_STATUS

  @Field(() => [FilmTopCast])
  @Column({ type: 'jsonb' })
  @Expose()
  topCasts: FilmTopCast[]

  @Field(() => [String], { nullable: true })
  @Column({ type: 'varchar', array: true, nullable: true })
  gallery?: string[] | null

  @Field(() => GraphQLISODateTime)
  @Column()
  @Expose()
  endDateSubscriber: Date

  @Field(() => [String], { nullable: true })
  @Column({ type: 'varchar', array: true, nullable: true })
  whiteList?: string[] | null

  @ManyToOne(() => PersonEntity, person => person.films)
  person: PersonEntity

  @OneToMany(() => FilmEventEntity, event => event.film)
  events: FilmEventEntity[]

  @OneToMany(() => FilmCompressedNFTEntity, (compressedNFT) => compressedNFT.film)
  compressedNFTs: FilmCompressedNFTEntity[]
}
