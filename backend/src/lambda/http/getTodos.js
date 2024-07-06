import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getListTodoByUserId } from '../../dataLayer/todosAccess.mjs';
import { getUserId } from '../utils.mjs';
export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    const userId = getUserId(event);
    const rs = await getListTodoByUserId(userId);
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        rs
      }),
    };
  })