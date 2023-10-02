import { FilmCollectionNFTEntity } from '@/db/entities/filmCollectionNFT'
import { BadRequestException, Injectable } from '@nestjs/common'
import { GetFilmCollectionNFTCommand } from './commands/getFilmCollectionNFT.command'
import { plainToClass } from 'class-transformer'
import { CreateCollectionNFTDto, PublicInformationFilmCollectionNFT } from './dtos'
import { PersonEntity } from '@/db/entities/person'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { GetFilmCommand } from '@/film/commands/GetFilm.command'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { config } from '@/config'
import { convertStringToUnitArray } from '@/utils'
import { NFTService } from '@/nft/nft.service'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class FilmCollectionNFTService {
  constructor(
    @InjectRepository(FilmCollectionNFTEntity)
    private filmCollectionNFTRepository: Repository<FilmCollectionNFTEntity>,
    private readonly nftService: NFTService
  ) {}

  async getById(id: number): Promise<PublicInformationFilmCollectionNFT> {
    return plainToClass(FilmCollectionNFTEntity, await GetFilmCollectionNFTCommand.getById(id), {
      excludeExtraneousValues: true
    })
  }

  async createCollection(input: CreateCollectionNFTDto, person: PersonEntity): Promise<ReturnMessageBase> {
    if (!person.publicKey) {
      throw new BadRequestException(`FilmMaker needed provide publickey`)
    }

    const { name, symbol, uri } = input.metadata

    const film = await GetFilmCommand.getByFilmIdAndPersonId(input.filmId, person.id)
    const adminSecretKeyUnit8Array = convertStringToUnitArray(config.admin.secretKey)

    const adminKeypair = Keypair.fromSecretKey(adminSecretKeyUnit8Array)

    const { masterEditionAccount, metadataAccount, mint, tokenAccount, treeKeypair } =
      await this.nftService.createCollection({
        adminKeypair,
        collectionMetadataDto: input.metadata,
        connection: new Connection(config.rpcUrl, 'confirmed'),
        filmMakerPubKey: new PublicKey(person.publicKey)
      })

    await this.filmCollectionNFTRepository.save({
      film,
      name,
      symbol,
      uri,
      masterEditionAccount: masterEditionAccount.toBase58(),
      metadataAccount: metadataAccount.toBase58(),
      mint: mint.toBase58(),
      tokenAccount: tokenAccount.toBase58(),
      treeKeypair: treeKeypair.toBase58()
    } as FilmCollectionNFTEntity)

    return {
      message: `Create collection NFT for film success`,
      success: true
    }
  }
}
