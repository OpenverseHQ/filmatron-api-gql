import { Args, ID, Resolver, Query, Mutation } from '@nestjs/graphql'
import { FilmCollectionNFTService } from './film-collection-nft.service'
import { CreateCollectionNFTDto, PublicInformationFilmCollectionNFT } from './dtos'
import { AuthKylan } from '@/common/decorators/auth.decorator'
import { ROLE } from '@/common/constant'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { Person } from '@/common/decorators/person.decorator'
import { PersonEntity } from '@/db/entities/person'

@Resolver()
export class FilmCollectionNFTResolver {
  constructor(private readonly filmCollectionNFTService: FilmCollectionNFTService) {}

  @Query(() => PublicInformationFilmCollectionNFT, { name: 'getFilmCollectionNFTById' })
  async getById(@Args('id', { type: () => ID }) id: number): Promise<PublicInformationFilmCollectionNFT> {
    return await this.filmCollectionNFTService.getById(id)
  }

  @AuthKylan([ROLE.FILMMAKER])
  @Mutation(() => ReturnMessageBase, {})
  async createCollection(@Args('input') input: CreateCollectionNFTDto, @Person() person: PersonEntity) {
    return await this.filmCollectionNFTService.createCollection(input, person)
  }
}
