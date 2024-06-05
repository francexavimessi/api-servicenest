import { Injectable } from '@nestjs/common';
import { DecryptDataDto } from './dto/decrypt-data.dto';
import { EncryptDataDto } from './dto/encrypt-data.dto';

import * as crypto from 'crypto';
import * as fs from 'fs';
import { log } from 'console';

@Injectable()
export class EncryptionService {
  private publicKey: string;
  private privateKey: string;

  constructor() {
    this.publicKey = fs.readFileSync('./public.pem', 'utf8');
    this.privateKey = fs.readFileSync('./private.pem', 'utf8');
  }

  getEncryptData(encryptDataDto: EncryptDataDto) {
    // Validate request payload
    if (encryptDataDto.payload.length > 2000) {
      return {
        successful: false,
        error_code: 'Payload too long',
        data: null,
      };
    }

    // Step 2: Create AES key
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    // Step 3: Encrypt payload with AES key
    const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
    let encryptedData = cipher.update(encryptDataDto.payload, 'utf8', 'hex');
    encryptedData += cipher.final('hex');

    // Step 4: Encrypt AES key with public key
    const encryptedAesKey = crypto
      .publicEncrypt(
        {
          key: this.publicKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: 'sha256',
        },
        aesKey,
      )
      .toString('base64');

    return {
      successful: true,
      error_code: null,
      data: {
        data1: encryptedAesKey,
        data2: iv.toString('hex') + ':' + encryptedData, // Concatenate IV with encrypted data
      },
    };
  }

  getDecryptData(decryptDataDto: DecryptDataDto) {
    // Validate request payload
    if (!decryptDataDto.data1 || !decryptDataDto.data2) {
      return {
        successful: false,
        error_code: 'Invalid data',
        data: null,
      };
    }
    console.log(this.privateKey);

    // Step 2: Decrypt AES key with private key
    const decryptedAesKey = crypto.privateDecrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(decryptDataDto.data1, 'base64'),
    );

    // Step 3: Get payload, decrypt data2 with AES key
    const dataParts = decryptDataDto.data2.split(':');
    const iv = Buffer.from(dataParts[0], 'hex');
    const encryptedData = Buffer.from(dataParts[1], 'hex');
    let encryptedDataString = Buffer.from(encryptedData);
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      decryptedAesKey,
      iv,
    );
    let decryptedData = decipher.update(encryptedData);
    let decryptedData2 = decipher.final('utf8');

    return {
      successful: true,
      error_code: null,
      data: {
        payload: decryptedData2,
      },
    };
  }
}
