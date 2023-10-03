import { WhitelistEntity } from "@/db/entities/whitelist";
import { getRepository } from "typeorm";

export class GetWhitelistCommand {
  static async getWhiteListOfFilm(filmId: number, relations?: string[]): Promise<WhitelistEntity[]> {
    return await getRepository(WhitelistEntity).find({ where: { filmId }, relations })
  }
}