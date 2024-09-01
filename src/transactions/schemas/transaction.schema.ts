import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'transactions' })
export class TransactionDocument {
  @Prop()
  _id: string;

  @Prop()
  amount: string;

  @Prop({ type: Date })
  timestamp: Date;

  @Prop()
  description: string;

  @Prop()
  transactionType: string;

  @Prop()
  accountNumber: string;

  @Prop({ default: null })
  category: string | null;
}

export const TransactionSchema = SchemaFactory.createForClass(TransactionDocument);
