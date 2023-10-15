import { NFTService } from './nft.service'
import { Args, ID, Mutation, Resolver, Query } from '@nestjs/graphql'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { AuthKylan } from '@/common/decorators/auth.decorator'
import { ROLE } from '@/common/constant'
import { CreateCompressedNFTMetadata, PaginatedCompressedNFT } from './dtos'
import { Person } from '@/common/decorators/person.decorator'
import { PersonEntity } from '@/db/entities/person'
import { PaginationArgs } from '@/common/interface'
import { FilmCompressedNFTEntity } from '@/db/entities/filmCompressedNFT'
import { FilmEntity } from '@/db/entities/film'

@Resolver()
export class NFTResolver {
  constructor(private readonly nftService: NFTService) {}

  @AuthKylan([ROLE.FILMMAKER])
  @Mutation(() => ReturnMessageBase)
  async createCompressedNFTMetadata(@Args('input') input: CreateCompressedNFTMetadata, @Person() person: PersonEntity) {
    return await this.nftService.createCompressNFTMetadata(input, person)
  }

  @Query(() => PaginatedCompressedNFT, { name: 'getCompressedNFTsOfFilm' })
  async getCompressedNFTsOfFilm(
    @Args('filmId', { type: () => ID }) filmId: number,
    @Args() paginationArgs: PaginationArgs
  ): Promise<PaginatedCompressedNFT> {
    return await this.nftService.getCompressedNFTsOFFilm(filmId, paginationArgs)
  }

  @Query(() => FilmCompressedNFTEntity, { name: 'getCompressedNFT' })
  async getCompressedNFT(@Args('id', { type: () => ID }) id: number): Promise<FilmCompressedNFTEntity> {
    return await this.nftService.getCompressedNFT(id)
  }

  @Query(() => FilmEntity, { name: 'getFilmByCompressedNFT' })
  async getFilmByCompressedNFT(@Args('name', { type: () => String }) name: string): Promise<FilmEntity> {
    return await this.nftService.getFilmOfCompressedNFT(name)
  }

}
