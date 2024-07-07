import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { updateImageUrl } from '../../businessLogic/todo.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true,
  }))
  .handler(async (event) => {
    const uploadUrl = await updateImageUrl(event);
    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl
      }),
    };
  })