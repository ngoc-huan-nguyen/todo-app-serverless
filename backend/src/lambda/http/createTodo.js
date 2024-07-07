import middy from '@middy/core'
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { create } from '../../businessLogic/todo.mjs';
import { getUserId } from '../utils.mjs';
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth');

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true,
  }))
  .handler(async (event) => {
  logger.info(event);
  const body = JSON.parse(event.body);
  const userId = getUserId(event);
  body.userId = userId;
  const item = await create(body);
  return {
    statusCode: 200,
    body: JSON.stringify({
      item
    }),
  };
});

