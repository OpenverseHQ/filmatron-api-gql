import { Injectable } from '@nestjs/common'
import { ValidDepthSizePair } from '@solana/spl-account-compression'
import { MetadataArgs, TokenProgramVersion, TokenStandard } from '@metaplex-foundation/mpl-bubblegum'
import { CreateMetadataAccountArgsV3 } from '@metaplex-foundation/mpl-token-metadata'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { CreateTreeCommand } from './commands/createTree.command'
import { CreateCollectionCommand } from './commands/createCollection.command'
import { CollectionInformation } from '@/common/types'
import { FilmCollectionNFTEntity } from '@/db/entities/filmCollectionNFT'
import { MintCompressedNFTCommand } from './commands/mintCompressedNFT.command'
import { CompressedNFTMetadata, CreateCompressedNFTMetadata, PaginatedCompressedNFT } from './dtos'
import { PersonEntity } from '@/db/entities/person'
import { InjectRepository } from '@nestjs/typeorm'
import { FilmCompressedNFTEntity } from '@/db/entities/filmCompressedNFT'
import { Repository } from 'typeorm'
import { GetFilmCommand } from '@/film/commands/GetFilm.command'
import { ReturnMessageBase } from '@/common/interface/returnBase'
import { CollectionMetadataDto } from '@/film-collection-nft/dtos'
import { PaginationArgs } from '@/common/interface'
import { paginate } from '@/common/paginate'
import { GetFilmCompressedNFTCommand } from './commands/getFilmCompressedNFT.command'
import { FilmEntity } from '@/db/entities/film'

@Injectable()
export class NFTService {
  constructor(
    @InjectRepository(FilmCompressedNFTEntity)
    private readonly filmCompressedNFTRepository: Repository<FilmCompressedNFTEntity>
  ) {}

  async createCollection(params: {
    connection: Connection
    filmMakerPubKey: PublicKey
    adminKeypair: Keypair
    collectionMetadataDto: CollectionMetadataDto
  }): Promise<CollectionInformation> {
    const { adminKeypair, connection, filmMakerPubKey, collectionMetadataDto } = params
    const { name, symbol, uri } = collectionMetadataDto

    /* define tree size for save Compressed NFT */
    const maxDepthSizePair: ValidDepthSizePair = {
      // max=16,384 nodes
      maxDepth: 14,
      maxBufferSize: 64
    }
    const canopyDepth = maxDepthSizePair.maxDepth - 5

    /**
     * Allocate the tree on chain
     */
    // define the address (account) the tree will live
    const treeKeypair = Keypair.generate()

    // create and send transaction to create the tree on chain
    const tree = await CreateTreeCommand.createTree({
      connection,
      canopyDepth,
      filmMakerPubKey,
      payer: adminKeypair,
      maxDepthSizePair,
      treeKeypair
    })

    const collectionMetadatV3: CreateMetadataAccountArgsV3 = {
      data: {
        name,
        symbol,
        uri,
        sellerFeeBasisPoints: 100,
        creators: [
          {
            address: filmMakerPubKey,
            share: 100,
            verified: false
          }
        ],
        collection: null,
        uses: null
      },
      isMutable: false,
      collectionDetails: null
    }

    const { masterEditionAccount, metadataAccount, mint, tokenAccount } =
      await CreateCollectionCommand.createCollection({
        connection,
        metadataV3: collectionMetadatV3,
        payer: adminKeypair
      })

    return {
      masterEditionAccount,
      metadataAccount,
      mint,
      tokenAccount,
      treeKeypair: treeKeypair.publicKey
    }
  }

  // Need to validate the mint, tokenAccount, etc ... when mint compressed nft
  async mintCompressedNFT(params: {
    compressedNFTMetadata: CompressedNFTMetadata
    creatorPubKey: PublicKey
    payer: Keypair
    filmCollectionNFT: FilmCollectionNFTEntity
    receiverAddress: PublicKey
    connection: Connection
  }): Promise<void> {
    const { compressedNFTMetadata, creatorPubKey, filmCollectionNFT, receiverAddress, payer, connection } = params

    const { name, symbol, uri } = compressedNFTMetadata
    const { mint, metadataAccount, masterEditionAccount, treeKeypair } = filmCollectionNFT

    const compressedMetadata: MetadataArgs = {
      name,
      symbol,
      uri,
      creators: [
        {
          address: creatorPubKey,
          verified: false,
          share: 100
        }
      ],
      editionNonce: 0,
      uses: null,
      collection: null,
      primarySaleHappened: false,
      sellerFeeBasisPoints: 0,
      isMutable: false,
      // these values are taken from the Bubblegum package
      tokenProgramVersion: TokenProgramVersion.Original,
      tokenStandard: TokenStandard.NonFungible
    }

    // fully mint a single compressed NFT to the payer
    console.log(`Minting a single compressed NFT to ${creatorPubKey.toBase58()}...`)
    console.log(
      `tree: ${treeKeypair}`,
      `mint: ${mint}`,
      `metadata: ${metadataAccount}`,
      `master: ${masterEditionAccount}`,
      `compressedMetadata: ${compressedMetadata}`
    )

    await MintCompressedNFTCommand.mintCompressedNFT({
      connection,
      payer,
      treeAddress: new PublicKey(treeKeypair),
      collectionMint: new PublicKey(mint),
      collectionMasterEditionAccount: new PublicKey(masterEditionAccount),
      collectionMetadata: new PublicKey(metadataAccount),
      compressedNFTMetadata: compressedMetadata,
      receiverAddress
    })
  }

  async createCompressNFTMetadata(
    input: CreateCompressedNFTMetadata,
    person: PersonEntity
  ): Promise<ReturnMessageBase> {
    const { filmId, name, symbol, uri } = input

    const film = await GetFilmCommand.getByFilmIdAndPersonId(filmId, person.id)
    await this.filmCompressedNFTRepository.save({
      film,
      name,
      symbol,
      uri
    } as FilmCompressedNFTEntity)

    return {
      success: true,
      message: 'create film compressed metadata successfully'
    }
  }

  async getCompressedNFTsOFFilm(filmId: number, paginationArgs: PaginationArgs): Promise<PaginatedCompressedNFT> {
    const query = this.filmCompressedNFTRepository
      .createQueryBuilder()
      .select()
      .where('FilmCompressedNFTEntity.filmId = :filmId', { filmId })

    return paginate<FilmCompressedNFTEntity>({ query, paginationArgs, defaultLimit: 7 })
  }

  async getCompressedNFT(id: number): Promise<FilmCompressedNFTEntity> {
    return await GetFilmCompressedNFTCommand.getById(id)
  }

  async getFilmOfCompressedNFT(nftName: string): Promise<FilmEntity> {
    const nft = await GetFilmCompressedNFTCommand.getByName(nftName, ['film'])

    return nft.film
  }
}
