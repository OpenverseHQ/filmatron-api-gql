import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { FilmEntity } from './film'

@Entity('film-compressed-nft')
@ObjectType({ isAbstract: true })
export class FilmCompressedNFTEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  name: string

  @Field()
  @Column()
  symbol: string

  @Field()
  @Column()
  uri: string

  @Field()
  @Column()
  filmId: number

  @ManyToOne(() => FilmEntity, film => film.compressedNFTs)
  @JoinColumn({ name: 'filmId' })
  film: FilmEntity
}
