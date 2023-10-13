import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { CloudinaryService } from './cloudinary/cloudinary.service';

interface JWKSData {
  kty: string
  n: string
  e: string
  alg: string
  kid: string
  use: string
}

@Controller('api/rest')
export class RestController {
  constructor(private readonly appService: CloudinaryService) {}
  @Get('/jwks')
  getJWKS(): JWKSData {
    const jwksData: JWKSData = {
      kty: 'RSA',
      n: 'viVcXhPjBsV_WzCvsTUEUwkCFK_XyrxQK03Mr55Y7RLHFFYTbkgeEQ83VMmomJKECcLomaHprH73PiTTmb2-DwGK5VTBkem0KrW1Kz1dn2oUufs5B4K5YjKhVqaRImbUAeAJ4sfsF0hrS6jkv3NlzZ-B_qCRNdCJlhzZrqQTWo3CnGDJCWHB50PWFDfvCO_3wv--d0S217w0VDGeU7CYtsSv4PvjgncVi3wF1pMcc90SIyn0IwrlGLEA41aLAQRexulLJdstODzrT2pfbRlINfs6tewz_PZDfC2Zt0sRf98DQG8zE5Hm-dDs9w_oyeZCmIxuXfR19gXIS3kU69hUAQ',
      e: 'AQAB',
      alg: 'RS256',
      kid: '3sFDKYCFkWHwfVWzkWj7RL3poZtgWDqJmgPny2DVcV87',
      use: 'sig'
    }
    return jwksData
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.appService.uploadImage(file);
  }
}
