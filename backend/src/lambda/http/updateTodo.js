import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { update } from '../../businessLogic/todo.mjs';
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    const userId = getUserId(event);
    const body = JSON.parse(event.body);
    const todoId = event.pathParameters.todoId;

    let rs = await update(body, userId, todoId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        rs
      }),
    };
  })