import { setupE2EContext } from './e2e-context';
import supertest from 'supertest';
import { TransactionDocument } from '../src/transactions/schemas/transaction.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { TransactionCategoriserService } from '../src/categoriser/transaction-categoriser.service';

describe('Transactions Controller', () => {
  const scheduleTransactionCategoriseMock = jest.fn();

  const context = setupE2EContext((builder) =>
    builder.overrideProvider(TransactionCategoriserService).useValue({
      scheduleTransactionCategorise: scheduleTransactionCategoriseMock,
    })
  );

  let transactionModel: Model<TransactionDocument>;

  beforeAll(async () => {
    transactionModel = context.app.get<Model<TransactionDocument>>(
      getModelToken(TransactionDocument.name)
    ) as Model<TransactionDocument>;
  });

  beforeEach(async () => {
    await transactionModel.deleteMany({});
  });

  describe('When valid transactions are present in database', () => {
    const transactions = [
      {
        transactionId: 'transaction1',
        amount: '100.00',
        timestamp: '2024-09-01 12:00:00',
        description: 'Transaction 1',
        transactionType: 'credit',
        accountNumber: '12345678',
      },
      {
        transactionId: 'transaction2',
        amount: '200.00',
        timestamp: '2024-09-01 12:30:00',
        description: 'Transaction 2',
        transactionType: 'debit',
        accountNumber: '87654321',
      },
      {
        transactionId: 'transaction3',
        amount: '300.00',
        timestamp: '2024-09-01 13:00:00',
        description: 'Transaction 3',
        transactionType: 'credit',
        accountNumber: '12345678',
      },
    ];

    beforeEach(async () => {
      for (const transaction of transactions) {
        await supertest.agent(context.app.getHttpServer()).post('/transactions').send(transaction).expect(201);
        expect(scheduleTransactionCategoriseMock).toHaveBeenCalledWith(transaction.transactionId);
      }
    });

    it('GET /transactions - should return transactions with correct response body', async () => {
      await supertest
        .agent(context.app.getHttpServer())
        .get('/transactions')
        .query({ limit: 3 })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(3);
          res.body.forEach((transaction, index) => {
            expect(transaction).toHaveProperty('transactionId', transactions[index].transactionId);
            expect(transaction).toHaveProperty('amount', transactions[index].amount);
            expect(transaction).toHaveProperty('timestamp', transactions[index].timestamp);
            expect(transaction).toHaveProperty('description', transactions[index].description);
            expect(transaction).toHaveProperty('transactionType', transactions[index].transactionType);
            expect(transaction).toHaveProperty('accountNumber', transactions[index].accountNumber);
          });
        });
    });

    it('GET /transactions - should return transactions starting after a specific transactionId', async () => {
      await supertest
        .agent(context.app.getHttpServer())
        .get('/transactions')
        .query({ limit: 2, after: 'transaction1' })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(2); // Should return the remaining transactions
          expect(res.body[0]).toHaveProperty('transactionId', 'transaction2');
          expect(res.body[1]).toHaveProperty('transactionId', 'transaction3');
        });

      await supertest
        .agent(context.app.getHttpServer())
        .get('/transactions')
        .query({ limit: 2, after: 'transaction2' })
        .expect(200)
        .expect((res) => {
          expect(res.body.length).toBe(1); // Should return only 'transaction3'
          expect(res.body[0]).toHaveProperty('transactionId', 'transaction3');
        });
    });

    it('GET /transactions/:transactionId - should retrieve individual transactions with correct response body', async () => {
      for (const transaction of transactions) {
        await supertest
          .agent(context.app.getHttpServer())
          .get(`/transactions/${transaction.transactionId}`)
          .expect(200)
          .expect((res) => {
            expect(res.body).toMatchObject({
              transactionId: transaction.transactionId,
              amount: transaction.amount,
              timestamp: transaction.timestamp,
              description: transaction.description,
              transactionType: transaction.transactionType,
              accountNumber: transaction.accountNumber,
            });
          });
      }
    });

    it('GET /transactions/:transactionId - should return 404 if transaction not found', async () => {
      await supertest.agent(context.app.getHttpServer()).get('/transactions/nonExistentTransactionId').expect(404);
    });
  });

  describe('When transactions are not valid', () => {
    const invalidTransactions = [
      {
        // Missing transactionId
        amount: '100.00',
        timestamp: '2024-09-01 12:00:00',
        description: 'Invalid transaction 1',
        transactionType: 'credit',
        accountNumber: '12345678',
      },
      {
        // Missing amount
        transactionId: 'invalidTransaction2',
        timestamp: '2024-09-01 12:00:00',
        description: 'Invalid transaction 2',
        transactionType: 'debit',
        accountNumber: '87654321',
      },
      {
        // Invalid timestamp format
        transactionId: 'invalidTransaction3',
        amount: '300.00',
        timestamp: '2024-09-01 13:00', // Invalid format
        description: 'Invalid transaction 3',
        transactionType: 'credit',
        accountNumber: '12345678',
      },
      {
        // Missing description (Optional but checking behavior)
        transactionId: 'invalidTransaction4',
        amount: '400.00',
        timestamp: '2024-09-01 14:00:00',
        transactionType: 'debit',
        accountNumber: '87654321',
      },
      {
        // Missing transactionType
        transactionId: 'invalidTransaction5',
        amount: '500.00',
        timestamp: '2024-09-01 15:00:00',
        description: 'Invalid transaction 5',
        accountNumber: '12345678',
      },
      {
        // Missing accountNumber
        transactionId: 'invalidTransaction6',
        amount: '600.00',
        timestamp: '2024-09-01 16:00:00',
        description: 'Invalid transaction 6',
        transactionType: 'credit',
      },
    ];

    it('POST /transactions - should return 400 if required fields are missing or invalid', async () => {
      await transactionModel.deleteMany({});
      for (const invalidTransaction of invalidTransactions) {
        await supertest.agent(context.app.getHttpServer()).post('/transactions').send(invalidTransaction).expect(400);
      }
    });

    it('POST /transactions - should return specific error message for invalid timestamp format', async () => {
      const invalidTimestampTransaction = {
        transactionId: 'invalidTransaction7',
        amount: '700.00',
        timestamp: '09/01/2024 17:00:00', // Invalid format
        description: 'Invalid transaction 7',
        transactionType: 'debit',
        accountNumber: '87654321',
      };

      await supertest
        .agent(context.app.getHttpServer())
        .post('/transactions')
        .send(invalidTimestampTransaction)
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('timestamp must be in YYYY-MM-DD HH:mm:ss format');
        });
    });
  });
});
