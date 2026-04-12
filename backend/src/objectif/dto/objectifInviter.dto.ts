import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ObjectifInviterDto {
  @ApiProperty({
    example: 'exemple@gmail.com',
    description: 'courriel de la personne a inviter',
  })
  @IsEmail()
  email: string;
}
