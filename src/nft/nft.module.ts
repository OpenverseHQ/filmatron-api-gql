import { Module } from '@nestjs/common'
import { NFTService } from './nft.service'

@Module({
  providers: [NFTService],
  exports: [NFTService]
})
export class NFTModule {}
