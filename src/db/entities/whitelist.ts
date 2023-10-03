import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { PersonEntity } from './person'
import { FilmEntity } from './film'
import { PublicInformationPerson } from '@/whitelist/dtos'

@Entity('whitelist')
@ObjectType({ isAbstract: true })
export class WhitelistEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  personId: number

  @Field()
  @Column()
  filmId: number

  @Field(() => PublicInformationPerson)
  @ManyToOne(() => PersonEntity, person => person.whitelist)
  @JoinColumn({ name: 'personId' })
  person: PersonEntity

  @ManyToOne(() => FilmEntity, film => film.whitelist)
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity
}
