import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUploadUrl } from '../../fileStorage/attatchmentUtils.mjs';
import { createLogger } from '../../utils/logger.mjs'
import { updateImageUrl } from '../../businessLogic/todo.mjs';
import { getUserId } from '../utils.mjs';
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
    await updateImageUrl(userId, todoId, logger);
    const uploadUrl = await getUploadUrl(todoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      }),
    };
  })