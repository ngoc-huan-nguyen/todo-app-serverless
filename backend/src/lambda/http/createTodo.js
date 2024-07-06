import middy from '@middy/core'
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { create } from '../../businessLogic/todo.mjs';

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true,
  }))
  .handler(async (event) => {
  const body = JSON.parse(event.body);

  const data = await create(body);
  return {
    statusCode: 200,
    body: JSON.stringify({
      data
    }),
  };
});

