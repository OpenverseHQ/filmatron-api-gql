import { Injectable } from '@nestjs/common'
import { ValidDepthSizePair } from '@solana/spl-account-compression'
import { CreateMetadataAccountArgsV3 } from '@metaplex-foundation/mpl-token-metadata'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { CreateTreeCommand } from './commands/createTree.command'
import { CreateCollectionCommand } from './commands/createCollection.command'
import { CollectionMetadataDto } from '@/filmMaker/dto'
import { CollectionData } from '@/common/types'

@Injectable()
export class NFTService {
  async createCollection(params: {
    connection: Connection
    filmMakerPubKey: PublicKey
    adminKeypair: Keypair
    collectionMetadataDto: CollectionMetadataDto
  }): Promise<CollectionData> {
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

    return await CreateCollectionCommand.createCollection({
      connection,
      metadataV3: collectionMetadatV3,
      payer: adminKeypair
    })
  }
}
