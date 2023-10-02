import { Message, MessageName } from '@/common/message'
import { FilmCollectionNFTEntity } from '@/db/entities/filmCollectionNFT'
import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getRepository } from 'typeorm'

export class GetFilmCollectionNFTCommand {
  static async getByFilmId(filmId: number): Promise<FilmCollectionNFTEntity> {
    const filmCollectionNFT = await getRepository(FilmCollectionNFTEntity).findOne({ where: { film: { id: filmId } } })

    if (!filmCollectionNFT) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.collectionNFT))
    }

    const { masterEditionAccount, mint, metadataAccount, tokenAccount, treeKeypair } = filmCollectionNFT
    if (!masterEditionAccount || !mint || !metadataAccount || !tokenAccount || !treeKeypair) {
      console.log(
        'information about collection nft not have save to database include (masterEditionAccount, mint, metadataAccount, tokenAccount, treeKeypair)'
      )
      throw new BadRequestException(Message.Film.NFT_COLLECTION_NOT_CREATED)
    }

    return filmCollectionNFT
  }

  static async getById(id: number): Promise<FilmCollectionNFTEntity> {
    const filmCollectionNFT = await getRepository(FilmCollectionNFTEntity).findOne({ where: { id } })

    if (!filmCollectionNFT) {
      throw new NotFoundException(Message.Base.NotFound(MessageName.collectionNFT))
    }

    const { masterEditionAccount, mint, metadataAccount, tokenAccount, treeKeypair } = filmCollectionNFT
    if (!masterEditionAccount || !mint || !metadataAccount || !tokenAccount || !treeKeypair) {
      console.log(
        'information about collection nft not have save to database include (masterEditionAccount, mint, metadataAccount, tokenAccount, treeKeypair)'
      )
      throw new BadRequestException(Message.Film.NFT_COLLECTION_NOT_CREATED)
    }

    return filmCollectionNFT
  }
}
