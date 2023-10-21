import { ReturnMessageBase } from '@/common/interface/returnBase'
import { Message } from '@/common/message'
import { config } from '@/config'
import { FilmCompressedNFTEntity } from '@/db/entities/filmCompressedNFT'
import { PersonEntity } from '@/db/entities/person'
import { WhitelistEntity } from '@/db/entities/whitelist'
import { GetFilmCollectionNFTCommand } from '@/film-collection-nft/commands/getFilmCollectionNFT.command'
import { GetFilmCommand } from '@/film/commands/GetFilm.command'
import { GetFilmCompressedNFTCommand } from '@/nft/commands/getFilmCompressedNFT.command'
import { NFTService } from '@/nft/nft.service'
import { convertStringToUnitArray } from '@/utils'
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Keypair, PublicKey, Connection } from '@solana/web3.js'
import { Repository } from 'typeorm'

@Injectable()
export class UserService {
  constructor(
    private readonly nftService: NFTService,
    @InjectRepository(WhitelistEntity)
    private readonly whiteListRepository: Repository<WhitelistEntity>
  ) {}

  async mintCompressedNFT(cNFTId: number, person: PersonEntity): Promise<FilmCompressedNFTEntity> {
    if (!person.publicKey) {
      throw new BadRequestException(Message.User.NOT_FOUND_PUBLICKEY)
    }

    const filmCompressedNFT = await GetFilmCompressedNFTCommand.getById(cNFTId, ['film'])
    const film = await GetFilmCommand.getFilmById(filmCompressedNFT.film.id, ['person'])
    if(film.endDateSubscriber < new Date()) {
      throw new BadRequestException("Film NFT's mint date has ended")
    }
    const filmCollectionNFT = await GetFilmCollectionNFTCommand.getByFilmId(film.id)
    const adminUnit8ArraySecretKey = convertStringToUnitArray(config.admin.secretKey)

    const { name, symbol, uri } = filmCompressedNFT

    if (!film.person.publicKey) {
      console.log(`film maker not provide public key yet, need to update now`)
      throw new InternalServerErrorException()
    }

    await this.nftService.mintCompressedNFT({
      compressedNFTMetadata: {
        name,
        symbol,
        uri
      },
      creatorPubKey: new PublicKey(film.person.publicKey),
      payer: Keypair.fromSecretKey(adminUnit8ArraySecretKey),
      receiverAddress: new PublicKey(person.publicKey),
      connection: new Connection(config.rpcUrl, 'confirmed'),
      filmCollectionNFT
    })

    return filmCompressedNFT
  }

  async subscribeToWhitelist(filmId: number, person: PersonEntity): Promise<ReturnMessageBase> {
    const film = await GetFilmCommand.getFilmById(filmId)
    if (new Date() > film.endDateSubscriber) {
      throw new BadRequestException(Message.User.CAN_NOT_SUBSCRIBE_TO_WHITELIST)
    }

    await this.whiteListRepository.save({ filmId: film.id, personId: person.id })

    return {
      success: true,
      message: 'Subscribe to be whitelist of film successfully'
    }
  }
}
