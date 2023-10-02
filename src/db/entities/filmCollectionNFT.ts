import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { FilmEntity } from './film'

@Entity('film-collection-nft')
@ObjectType({ isAbstract: true })
export class FilmCollectionNFTEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Field()
  @Column()
  @Expose()
  name: string

  @Field()
  @Column()
  @Expose()
  symbol: string

  @Field()
  @Column()
  @Expose()
  uri: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  mint?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  tokenAccount?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  metadataAccount?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  masterEditionAccount?: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  treeKeypair?: string | null

  @OneToOne(() => FilmEntity)
  @JoinColumn()
  film: FilmEntity
}
