import { ErrorDto } from '@ngdux/data-model-common';

export function createErrorDto(): ErrorDto {
  return {
    statusCode: 400,
    error: 'TEST_ERROR_CODE',
    message: 'test message',
    fieldErrors: []
  };
}
