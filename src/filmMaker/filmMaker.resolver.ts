import { Args, ID, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'
import { ROLE } from 'src/common/constant'
import { PersonService } from 'src/person/person.service'

@Resolver(PersonEntity)
export class FilmMakerResolver {
  constructor(private readonly filmMakerService: FilmMakerService, private readonly personService: PersonService) {}

  @Query(() => String)
  helloFilmMaker() {
    return 'hello'
  }

  @Query(() => PersonEntity, { name: 'getFilmMakerById' })
  async getById(@Args('id', { type: () => ID }) id: number): Promise<PersonEntity> {
    return await this.filmMakerService.getById(id)
  }

  @ResolveField(() => ROLE)
  async role(@Parent() person: PersonEntity): Promise<ROLE> {
    await this.personService.findById(person.id)

    return (await this.personService.findById(person.id, ['rolePerson'])).rolePerson.role
  }
}
