import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

import type {
  CreateTrainerRequest,
} from '@coaching/contracts';

export class CreateTrainerDto
  implements CreateTrainerRequest {

  @IsString()
  @Length(
    2,
    100,
  )
  firstName!: string;

  @IsOptional()
  @IsString()
  @Length(
    1,
    100,
  )
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(
    7,
    20,
  )
  phone?: string;

  @IsString()
  @IsNotEmpty()
  employee_code!: string;
}