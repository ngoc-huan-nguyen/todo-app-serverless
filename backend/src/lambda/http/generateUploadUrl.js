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
    try {
      const uploadUrl = await updateImageUrl(event);
      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error
        }),
      };
    }
  }
);