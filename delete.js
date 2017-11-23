import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';
import { fail } from 'assert';

export async function main(event, context, callback) {
  const params = {
    TableName: 'notes',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call('delete', params);
    callback(null, success({ success: true }));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}
