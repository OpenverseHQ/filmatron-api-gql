import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { ADMIN_PROCESS_STATUS, FILM_STATUS } from 'src/common/constant'
import { FilmTopCast } from 'src/common/types'
import { PersonEntity } from './person'
import { FilmGalleryEntity } from './filmGalery'
import { Expose } from 'class-transformer'
import { FilmCompressedNFTEntity } from './filmCompressedNFT'
import { WhitelistEntity } from './whitelist'

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

  @Field()
  @Column({ nullable: true })
  @Expose()
  background: string

  @Field()
  @Column({ nullable: true })
  @Expose()
  avatar: string

  @Field(() => Int)
  @Column()
  @Expose()
  duration: number

  @Field(() => GraphQLISODateTime)
  @Column({ nullable: true })
  @Expose()
  releaseDate: Date

  @Field(() => [String])
  @Column({ type: 'varchar', array: true })
  @Expose()
  genres: string[]

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

  @Field(() => [FilmTopCast], { nullable: true })
  @Column({ type: 'jsonb' })
  @Expose()
  topCasts: FilmTopCast[]

  @Field(() => GraphQLISODateTime)
  @Column()
  @Expose()
  endDateSubscriber: Date

  @ManyToOne(() => PersonEntity, person => person.films)
  person: PersonEntity

  @OneToMany(() => FilmGalleryEntity, event => event.film)
  galleries: FilmGalleryEntity[]

  @OneToMany(() => FilmCompressedNFTEntity, compressedNFT => compressedNFT.film)
  compressedNFTs: FilmCompressedNFTEntity[]

  @ManyToOne(() => WhitelistEntity, (whitelist) => whitelist.film)
  whitelist: WhitelistEntity[]
}
