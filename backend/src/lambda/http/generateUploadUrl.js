import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getSignedUrl } from '../../fileStorage/attatchmentUtils.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true,
  }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId;
    let data = await getSignedUrl(todoId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        data
      }),
    };
  })