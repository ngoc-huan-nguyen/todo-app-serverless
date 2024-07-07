import { v4 as uuidv4 } from 'uuid'
import { createTodo, updateTodo, deleteTodo, getListTodoByUserId, getTodo } from '../dataLayer/todosAccess.mjs'
import { getAttatchmentUrl } from '../fileStorage/attatchmentUtils.mjs';
import { getUserId } from '../lambda/utils.mjs';
import { getUploadUrl } from '../fileStorage/attatchmentUtils.mjs';
import { createLogger } from '../utils/logger.mjs';

const logger = createLogger('auth');

export async function getList(event) {
    try {
        logger.info(event);
        const userId = getUserId(event);
        let rs = await getListTodoByUserId(userId);
        if (rs.Items) {
            return rs.Items;
        }
        return [];
    } catch (error) {
        logger.error(error);
        throw new Error(error);
    }
}

export async function create(event) {
    try {
        logger.info(event);

        const userId = getUserId(event);

        const data = JSON.parse(event.body);
        data.userId = userId;
        data.todoId = uuidv4();
        data.createdAt = new Date().toISOString();
        let output = await createTodo(data);
        if (output) {
            return data;
        }
        return null;
    } catch (error) {
        logger.error(error);
        throw new Error(error);
    }
}

export async function update(event) {
    try {
        logger.info(event);
        const userId = getUserId(event);
        const todoId = event.pathParameters.todoId;

        const data = JSON.parse(event.body);

        let key = {
            userId: userId,
            todoId: todoId
        }
        return await updateTodo(data, key); 
    } catch (error) {
        logger.error(error);
        throw new Error(error);
    }
}

export async function remove(event) {
    try {
        logger.info(event);
        const todoId = event.pathParameters.todoId;
        const userId = getUserId(event);
        let key = {
            userId: userId,
            todoId: todoId
        }
        return await deleteTodo(key);
    } catch (error) {
        logger.error(error);
        throw new Error(error);
    }
}

export async function get(userId, todoId) {
    try {
        let key = {
            userId: userId,
            todoId: todoId
        }
        return await getTodo(key);
    } catch (error) {
        logger.error(error);
        throw new Error(error);
    }
}

export async function updateImageUrl(event) {
    try {
        logger.info(event);
        const todoId = event.pathParameters.todoId;
        const userId = getUserId(event);
        let todo = await get(userId, todoId);
        logger.info(todo);
        if (todo && todo.Item) {
            let data = todo.Item;
            let url = getAttatchmentUrl(todoId);
            data.attachmentUrl = url;

            let key = {
                userId: userId,
                todoId: todoId
            }

            await updateTodo(data, key);
            const uploadUrl = await getUploadUrl(todoId);
            return uploadUrl;
        }
        return null;
    } catch (error) {
        logger.error(error);
        throw new Error(error);
    }
}