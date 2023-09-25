import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'
import { ROLE } from 'src/common/constant'
import { PersonService } from 'src/person/person.service'
import { Auth } from 'src/common/decorators/auth.decorator'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { CreateCollectionNFTDto, CreateFilmDto } from './dto'
import { Person } from '@/common/decorators/person.decorator'

@Auth([ROLE.FILMMAKER])
@Resolver(PersonEntity)
export class FilmMakerResolver {
  constructor(private readonly filmMakerService: FilmMakerService, private readonly personService: PersonService) {}

  @Query(() => String)
  helloFilmMaker() {
    return 'hello'
  }

  @Query(() => PersonEntity)
  async getFilmMaker(@Args('id', { type: () => ID }) id: number): Promise<PersonEntity> {
    return await this.filmMakerService.findOne(id)
  }

  @Mutation(() => ReturnMessageBase)
  async createFilm(@Args('input') input: CreateFilmDto, @Person() person: PersonEntity): Promise<ReturnMessageBase> {
    return await this.filmMakerService.createFilm(input, person)
  }

  @Mutation(() => ReturnMessageBase)
  async createCollection(@Args('input') input: CreateCollectionNFTDto, @Person() person: PersonEntity) {
    return await this.filmMakerService.createCollection(input, person)
  }

  @ResolveField(() => ROLE)
  async role(@Parent() person: PersonEntity): Promise<ROLE> {
    await this.personService.findById(person.id)

    return (await this.personService.findById(person.id, ['rolePerson'])).rolePerson.role
  }
}

// TODO: create api update film
// TODO: test create collection
