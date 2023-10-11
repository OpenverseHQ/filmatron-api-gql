import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  ValidDepthSizePair,
  createAllocTreeIx
} from '@solana/spl-account-compression'
import { Connection, Keypair, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js'
import { PROGRAM_ID as BUBBLEGUM_PROGRAM_ID, createCreateTreeInstruction } from '@metaplex-foundation/mpl-bubblegum'
import { explorerURL, extractSignatureFromFailedTransaction } from '@/utils'
import {
  CreateMetadataAccountArgsV3,
  createCreateMasterEditionV3Instruction,
  createCreateMetadataAccountV3Instruction,
  createSetCollectionSizeInstruction
} from '@metaplex-foundation/mpl-token-metadata'
import { createAccount, createMint, mintTo, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { PROGRAM_ID as TOKEN_METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata'

export class CreateTreeCommand {
  /*
  Helper function to create a merkle tree on chain, including allocating 
  all the space required to store all the nodes
  */
  static async createTree(params: {
    canopyDepth: number
    connection: Connection
    maxDepthSizePair: ValidDepthSizePair
    payer: Keypair
    filmMakerPubKey: PublicKey
    treeKeypair: Keypair
  }): Promise<{
    treeAuthority: PublicKey
    treeAddress: PublicKey
  }> {
    const { canopyDepth, connection, filmMakerPubKey, maxDepthSizePair, payer, treeKeypair } = params

    console.log('Creating a new Merkle tree ....')
    console.log('treeAddress: ', treeKeypair.publicKey.toBase58())

    // derive the tree's authority (PDA), owned by Bubblegum
    const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
      [treeKeypair.publicKey.toBuffer()],
      BUBBLEGUM_PROGRAM_ID
    )
    console.log('treeAuthority', treeAuthority.toBase58())

    // allocate the tree's account on chain with the `space`
    // NOTE: this will compute the space needed to store the tree on chain (and the lamports required to store it)
    const allocTreeIx = await createAllocTreeIx(
      connection,
      treeKeypair.publicKey,
      payer.publicKey,
      maxDepthSizePair,
      canopyDepth
    )

    const createTreeIx = createCreateTreeInstruction(
      {
        payer: payer.publicKey,
        treeCreator: payer.publicKey,
        treeAuthority,
        merkleTree: treeKeypair.publicKey,
        compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
        logWrapper: SPL_NOOP_PROGRAM_ID
      },
      {
        maxBufferSize: maxDepthSizePair.maxBufferSize,
        maxDepth: maxDepthSizePair.maxDepth,
        public: false
      },
      BUBBLEGUM_PROGRAM_ID
    )

    try {
      // create and send the transaction to initialize the tree
      const tx = new Transaction().add(allocTreeIx).add(createTreeIx)
      tx.feePayer = payer.publicKey

      // send the transaction
      const txSignature = await sendAndConfirmTransaction(connection, tx, [treeKeypair, payer], {
        commitment: 'confirmed',
        skipPreflight: true
      })

      console.log('\nMerkle Tree created successfully')
      console.log(explorerURL({ txSignature }))

      return { treeAuthority, treeAddress: treeKeypair.publicKey }
    } catch (error: any) {
      console.error('\nFailed to create merkle tree:', error)

      // log a block explorer link for the failed transaction
      await extractSignatureFromFailedTransaction({ connection, err: error })

      throw error
    }
  }
}
