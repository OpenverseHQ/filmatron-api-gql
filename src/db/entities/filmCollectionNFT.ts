import { Field, ID } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { FilmEntity } from './film'

@Entity('film-collection-nft')
export class FilmCollectionNFT {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  mint: string

  @Field()
  @Column()
  tokenAccount: string

  @Field()
  @Column()
  metadataAccount: string

  @Field()
  @Column()
  masterEditionAccount: string

  @OneToOne(() => FilmEntity)
  @JoinColumn()
  film: FilmEntity
}