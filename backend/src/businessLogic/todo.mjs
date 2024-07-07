import { v4 as uuidv4 } from 'uuid'
import { createTodo, updateTodo, deleteTodo, getListTodoByUserId, getTodo } from '../dataLayer/todosAccess.mjs'
import { getAttatchmentUrl } from '../fileStorage/attatchmentUtils.mjs';

export async function getList(userId) {
    let rs = await getListTodoByUserId(userId);
    
    if (rs.Items) {
        return rs.Items;
    }
    return [];
}

export async function create(data) {
    data.todoId = uuidv4();
    data.createdAt = new Date().toISOString();
    let output = await createTodo(data);
    if (output) {
        return data;
    }
    return null;
}

export async function update(data, userId, todoId) {
    let key = {
        userId: userId,
        todoId: todoId
    }
    return await updateTodo(data, key);
}

export async function remove(userId, todoId) {
    let key = {
        userId: userId,
        todoId: todoId
    }
    return await deleteTodo(key);
}

export async function get(userId, todoId) {
    let key = {
        userId: userId,
        todoId: todoId
    }
    return await getTodo(key);
}

export async function updateImageUrl(userId, todoId, logger) {
    let todo = await get(userId, todoId);
    console.log('todo:', todo)
    logger.info(todo);
    if (todo && todo.Item) {
        let data = todo.Item;
        let url = await getAttatchmentUrl(todoId);
        data.attachmentUrl = url;
        await update(data, userId, todoId);
    }
}