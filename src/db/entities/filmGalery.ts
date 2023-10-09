import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { FilmEntity } from './film'
import { GALLERY_TYPE } from '@/common/constant'

@Entity('film-gallery')
@ObjectType({ isAbstract: true })
export class FilmGalleryEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number 
  
  @Field({ nullable: true })
  @Column()
  name: string

  @Field()
  @Column()
  url: string

  @Field(() => GALLERY_TYPE)
  @Column()
  type: GALLERY_TYPE

  @Field()
  @Column()
  filmId: number

  @ManyToOne(() => FilmEntity, film => film.galleries)
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity
}
