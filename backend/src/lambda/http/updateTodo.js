import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { update } from '../../businessLogic/todo.mjs';
import { createLogger } from '../../utils/logger.mjs'
import { getUserId } from '../utils.mjs';
const logger = createLogger('auth');
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    logger.info(event);
    const userId = getUserId(event);
    const body = JSON.parse(event.body);
    const todoId = event.pathParameters.todoId;

    let item = await update(body, userId, todoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        item
      }),
    };
  })