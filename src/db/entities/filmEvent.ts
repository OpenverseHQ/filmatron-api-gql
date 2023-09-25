import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { TimeDateScalar } from 'src/common/scalarGraphQL/timeDate'
import { FilmEntity } from './film'

@Entity('film-event')
@ObjectType({ isAbstract: true })
export class FilmEventEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  description: string

  @Field()
  @Column()
  image: string

  @Field(() => TimeDateScalar)
  @Column()
  startDate: Date

  @Field(() => TimeDateScalar)
  @Column()
  endDate: Date

  @ManyToOne(() => FilmEntity, film => film.events)
  film: FilmEntity
}
