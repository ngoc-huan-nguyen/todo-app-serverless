import middy from '@middy/core'
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { remove } from '../../businessLogic/todo.mjs';
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
    const todoId = event.pathParameters.todoId;
    const userId = getUserId(event);
    await remove(userId, todoId);
  
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: 'ok'
      }),
    };
  }
);

