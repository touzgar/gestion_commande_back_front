import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UTApi } from 'uploadthing/server';

@Injectable()
export class UploadService {
  private readonly utapi: UTApi;

  constructor() {
    // UploadThing v7+ reads UPLOADTHING_TOKEN from env automatically.
    if (!process.env.UPLOADTHING_TOKEN) {
      throw new InternalServerErrorException('UPLOADTHING_TOKEN manquant dans .env');
    }
    this.utapi = new UTApi();
  }

  async uploadImage(fileName: string, mimeType: string, fileBase64: string) {
    const rawBase64 = fileBase64.includes(',')
      ? fileBase64.split(',')[1]
      : fileBase64;

    if (!rawBase64) {
      throw new BadRequestException('Image base64 invalide');
    }

    const buffer = Buffer.from(rawBase64, 'base64');

    if (!buffer.length) {
      throw new BadRequestException('Fichier vide');
    }

    try {
      const file = new globalThis.File([buffer], fileName, { type: mimeType });
      
      const result: any = await this.utapi.uploadFiles([file]);

      console.log('Upload result full:', JSON.stringify(result, null, 2));

      if (!result || result.length === 0) {
        throw new InternalServerErrorException('Aucun résultat reçu - ' + JSON.stringify(result));
      }

      const data = result[0];
      console.log('First file data:', JSON.stringify(data, null, 2));

      if (!data) {
        throw new InternalServerErrorException('Données manquantes');
      }

      // UploadThing response structure
      const fileUrl = data?.file?.url || data?.data?.ufsUrl || data?.data?.url || data?.ufsUrl || data?.url;
      const fileKey = data?.file?.key || data?.data?.key || data?.key;
      const fileName_res = data?.file?.name || data?.data?.name || data?.name || fileName;
      const fileSize = data?.file?.size || data?.data?.size || data?.size;

      if (!fileUrl) {
        throw new InternalServerErrorException('Upload terminé mais URL manquante. Response: ' + JSON.stringify(data));
      }

      return {
        url: fileUrl,
        key: fileKey,
        name: fileName_res,
        size: fileSize,
      };
    } catch (error) {
      console.error('Upload error:', error);
      const message = error?.response?.data?.message || error.message || 'Erreur lors de l\'upload';
      throw new InternalServerErrorException(message);
    }
  }
}
