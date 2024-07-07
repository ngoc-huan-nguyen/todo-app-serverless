import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getList } from '../../businessLogic/todo.mjs';
import { getUserId } from '../utils.mjs';
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth');
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    logger.info(event);
    const userId = getUserId(event);
    const items = await getList(userId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      }),
    };
  })