import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d{1,6})?$/, {
    message: 'timestamp must be in YYYY-MM-DD HH:mm:ss[.SSSSSS] format',
  })
  timestamp: string;

  @IsString()
  description: string;

  @IsString()
  transactionType: string;

  @IsString()
  accountNumber: string;
}
