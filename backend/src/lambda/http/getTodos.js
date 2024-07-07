import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getList } from '../../businessLogic/todo.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    const items = await getList(event, logger);
    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      }),
    };
  })