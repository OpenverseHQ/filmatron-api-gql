import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { FilmMakerService } from './filmMaker.service'
import { PersonEntity } from 'src/db/entities/person'
import { ROLE } from 'src/common/constant'
import { PersonService } from 'src/person/person.service'
import { Auth } from 'src/common/decorators/auth.decorator'

@Resolver(PersonEntity)
export class FilmMakerResolver {
  constructor(private readonly filmMakerService: FilmMakerService, private readonly personService: PersonService) {}

  @Auth([ROLE.FILMMAKER])
  @Query(() => String)
  helloFilmMaker() {
    return 'hello'
  }

  @Query(() => PersonEntity)
  async getFilmMaker(@Args('id', { type: () => ID }) id: number): Promise<PersonEntity> {
    return await this.filmMakerService.findOne(id)
  }

  @ResolveField(() => ROLE)
  async role(@Parent() person: PersonEntity): Promise<ROLE> {
    await this.personService.findById(person.id)

    return (await this.personService.findById(person.id, ['rolePerson'])).rolePerson.role
  }
}
