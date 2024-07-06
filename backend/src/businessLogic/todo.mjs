import { v4 as uuidv4 } from 'uuid'
import { createTodo, updateTodo, deleteTodo, getListTodoByUserId } from '../dataLayer/todosAccess.mjs'
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
    data.attatchmentUrl = getAttatchmentUrl(data.todoId);
    let rs = await createTodo(data);
    if (rs) {
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