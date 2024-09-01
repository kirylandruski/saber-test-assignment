export const TRANSACTION_CATEGORISE_COMMAND_QUEUE_NAME = 'transaction_categorise_command';
export const TRANSACTION_CATEGORISE_JOB_NAME = 'transaction_categorise';

export const TRANSACTION_CATEGORISE_COMMAND_RETRY_OPTIONS = {
  attempts: 10,
  backoff: {
    type: 'exponential',
    delay: 100,
  },
};
