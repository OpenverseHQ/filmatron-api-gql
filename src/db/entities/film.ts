import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { FILM_GENRE, FILM_STATUS } from 'src/common/constant'
import { FilmTopCast } from 'src/common/types'
import { PersonEntity } from './person'
import { FilmEventEntity } from './filmEvent'

@Entity('film')
@ObjectType({ isAbstract: true })
export class FilmEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column({ type: 'varchar', length: 10000 })
  description: string

  @Field(() => Int)
  @Column()
  duration: number

  @Field()
  @Column()
  releaseDate: string

  @Field(() => [FILM_GENRE])
  @Column({ type: 'varchar', array: true, default: [] })
  genres: FILM_GENRE[]

  @Field(() => [String])
  @Column({ type: 'varchar', array: true, default: [] })
  stars: string[]

  @Field(() => [String])
  @Column({ type: 'varchar', array: true, default: [] })
  directors: string[]

  @Field(() => FILM_STATUS)
  @Column({ type: 'varchar' })
  status: FILM_STATUS

  @Field(() => [FilmTopCast])
  @Column({ type: 'jsonb' })
  topCasts: FilmTopCast[]

  @Field(() => [String])
  @Column({ type: 'varchar', array: true, default: [] })
  gallery: string[]

  @ManyToOne(() => PersonEntity, person => person.films)
  person: PersonEntity

  @OneToMany(() => FilmEventEntity, event => event.film)
  events: FilmEventEntity[]
}
