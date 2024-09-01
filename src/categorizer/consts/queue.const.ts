export const TRANSACTION_CATEGORIZE_COMMAND_QUEUE_NAME = 'transaction_categorize_command_queue';
export const TRANSACTION_CATEGORIZE_JOB_NAME = 'transaction_categorize_job';

export const TRANSACTION_CATEGORIZE_COMMAND_RETRY_OPTIONS = {
  attempts: 10,
  backoff: {
    type: 'exponential',
    delay: 100,
  },
};
