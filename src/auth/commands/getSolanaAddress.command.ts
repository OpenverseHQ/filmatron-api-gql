import { UnauthorizedException } from "@nestjs/common";
import { ReturnSolanaAddressDto } from "../dtos/auth.dto";
import { Message } from "@/common/message";

export class GetSolanaAddressCommand {
  static async getSolanaAddress(authorization: string): Promise<ReturnSolanaAddressDto> {
    let solanaAdress = '';
    if (authorization) {
      const url = 'https://filmatron-client-a88cb9.kylan.so/api/user/address/solana'

      await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: authorization
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then(data => {
          solanaAdress = data.address;
        })
        .catch(() => {
          throw new UnauthorizedException(Message.Base.NotFound('Token invalid'))
        })
    }
    
    if (solanaAdress) {
      return {
        address: solanaAdress
      }
    } else {
      return {
        address: ''
      }
    }
  }
}