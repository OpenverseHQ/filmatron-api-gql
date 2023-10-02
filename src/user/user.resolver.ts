import { Args, ID, Mutation, Resolver } from '@nestjs/graphql'
import { UserService } from './user.service'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { Person } from '@/common/decorators/person.decorator'
import { PersonEntity } from '@/db/entities/person'
import { AuthKylan } from '@/common/decorators/auth.decorator'
import { ROLE } from '@/common/constant'

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @AuthKylan([ROLE.USER])
  @Mutation(() => ReturnMessageBase)
  async mintCompressedNFT(@Args('cNFTId', { type: () => ID }) cNFTId: number, @Person() person: PersonEntity) {
    return await this.userService.mintCompressedNFT(cNFTId, person)
  }
}
