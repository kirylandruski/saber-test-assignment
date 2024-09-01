import { IsString } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class GetTransactionDto extends CreateTransactionDto {
  @IsString()
  category: string | null;
}
