import { IsString } from 'class-validator';

export class UploadImageDto {
  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;

  @IsString()
  fileBase64: string;
}
