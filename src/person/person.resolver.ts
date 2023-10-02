import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { PersonService } from './person.service'
import { UpdateInformationDto } from './dtos'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { Person } from '@/common/decorators/person.decorator'
import { PersonEntity } from '@/db/entities/person'
import { AuthKylan } from '@/common/decorators/auth.decorator'
import { ROLE } from '@/common/constant'

@Resolver()
export class PersonResolver {
  constructor(private readonly personService: PersonService) {}

  @Mutation(() => ReturnMessageBase)
  @AuthKylan([ROLE.FILMMAKER, ROLE.USER])
  async updateInformation(
    @Args('input') input: UpdateInformationDto,
    @Person() person: PersonEntity
  ): Promise<ReturnMessageBase> {
    return await this.personService.updateInformation(input, person)
  }
}
