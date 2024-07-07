import middy from '@middy/core'
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { remove } from '../../businessLogic/todo.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true,
  }))
  .handler(async (event) => {
    let result = await remove(event);
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: result
      }),
    };
  }
);

