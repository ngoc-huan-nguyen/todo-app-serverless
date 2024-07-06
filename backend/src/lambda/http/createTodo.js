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
  const newTodo = JSON.parse(event.body);

  const rs = await create(newTodo);
  return {
    statusCode: 200,
    body: JSON.stringify({
      rs
    }),
  };
});
