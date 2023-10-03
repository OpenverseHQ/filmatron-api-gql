import { Args, ID, Resolver, Query } from "@nestjs/graphql";
import { WhitelistService } from "./whitelist.service";
import { Person } from "@/common/decorators/person.decorator";
import { PersonEntity } from "@/db/entities/person";
import { WhitelistEntity } from "@/db/entities/whitelist";
import { AuthKylan } from "@/common/decorators/auth.decorator";
import { ROLE } from "@/common/constant";

@Resolver()
export class WhitelistResolver {
  constructor(
    private readonly whitelistService: WhitelistService
  ) {}

  @AuthKylan([ROLE.FILMMAKER])
  @Query(() => [WhitelistEntity], { name: 'getWhitelistOfFilm' })
  async getWhitelistOfFilm(@Args('filmId', { type: () => ID }) filmId: number, @Person() person: PersonEntity): Promise<WhitelistEntity[]> {
    return await this.whitelistService.getWhitelistOfFilm(filmId, person)
  }
}