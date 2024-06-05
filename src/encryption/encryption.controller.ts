import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EncryptionService } from './encryption.service';
import { DecryptDataDto } from './dto/decrypt-data.dto';
import { EncryptDataDto } from './dto/encrypt-data.dto';

@ApiTags('encryption')
@Controller()
export class EncryptionController {
  constructor(private readonly encryptionService: EncryptionService) {}

  @Post('get-encrypt-data')
  @ApiBody({ type: EncryptDataDto })
  @ApiResponse({ status: 200, description: 'Data encrypted successfully' })
  async getEncryptData(@Body() encryptDataDto: EncryptDataDto) {
    return this.encryptionService.getEncryptData(encryptDataDto);
  }

  @Post('get-decrypt-data')
  @ApiBody({ type: DecryptDataDto })
  @ApiResponse({ status: 200, description: 'Data decrypted successfully' })
  async getDecryptData(@Body() decryptDataDto: DecryptDataDto) {
    return this.encryptionService.getDecryptData(decryptDataDto);
  }
}
