import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bs58 from 'bs58'
import { PersonEntity } from 'src/db/entities/person'
import { CreateCollectionNFTDto, CreateFilmDto } from './dto'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { NFTService } from '@/nft/nft.service'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { config } from '@/config'
import { FilmCollectionNFT } from '@/db/entities/filmCollectionNFT'
import { FilmEntity } from '@/db/entities/film'
import { Message, MessageName } from '@/common/message'

@Injectable()
export class FilmMakerService {
  constructor(
    @InjectRepository(PersonEntity)
    private personRepository: Repository<PersonEntity>,
    @InjectRepository(FilmCollectionNFT)
    private filmCollectionNFTRepository: Repository<FilmCollectionNFT>,
    @InjectRepository(FilmEntity)
    private filmRepository: Repository<FilmEntity>,
    private nftService: NFTService
  ) {}

  async findOne(id: number): Promise<PersonEntity> {
    return await this.personRepository.findOneOrFail({ where: { id } })
  }

  /**
   * create film collection, save to the film collection nft. one-one film
   */
  async createCollection(input: CreateCollectionNFTDto, person: PersonEntity): Promise<ReturnMessageBase> {
    if (!person.publicKey) {
      throw new BadRequestException(`FilmMaker needed provide publickey`)
    }

    const film = await this.filmRepository.findOne({
      where: {
        id: input.id,
        person: {
          id: person.id
        }
      }
    })

    if (!film) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.film))
    }

    const adminKeypair = Keypair.fromSecretKey(bs58.decode(config.admin.secretKey))

    const { masterEditionAccount, metadataAccount, mint, tokenAccount } = await this.nftService.createCollection({
      adminKeypair,
      collectionMetadataDto: input.metadata,
      connection: new Connection(config.rpcUrl, 'confirmed'),
      filmMakerPubKey: new PublicKey(person.publicKey)
    })

    const collectionData = this.filmCollectionNFTRepository.create({
      film,
      masterEditionAccount: masterEditionAccount.toBase58(),
      metadataAccount: metadataAccount.toBase58(),
      mint: mint.toBase58(),
      tokenAccount: tokenAccount.toBase58()
    })

    await this.filmCollectionNFTRepository.save(collectionData)

    return {
      message: `Create collection NFT for film success`,
      success: true
    }
  }

  async createFilm(input: CreateFilmDto, person: PersonEntity): Promise<ReturnMessageBase> {
    await this.filmRepository.save(
      this.filmRepository.create({ ...input, person })
    )

    return {
      message: `Create film success`,
      success: true
    }
  }
}
