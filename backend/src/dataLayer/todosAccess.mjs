import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const dynamoDbDocument = DynamoDBDocument.from(new DynamoDB())
const todoTable = process.env.TODOS_TABLE;
const todoIndex = process.env.TODOS_CREATED_AT_INDEX;

export async function getListTodoByUserId(userId) {
    return await dynamoDbDocument.query({
        TableName: todoTable,
        IndexName: todoIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    });
}

export async function createTodo(data) {
    return await dynamoDbDocument.put({
        TableName: todoTable,
        Item: data
    });
}

export async function updateTodo(data, key) {
    const command = new UpdateCommand({
        TableName: todoTable,
        Key: key,
        UpdateExpression: "set name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeValues: {
          ":name": data.name,
          ":dueDate": data.dueDate,
          ":done": data.done,
        },
        ReturnValues: "ALL_NEW"
    });

    const rs = await dynamoDbDocument.update(command);
    return rs.Item;
}

export async function deleteTodo(key) {
    await this.dynamoDbClient.delete({
        TableName: todoTable,
        Key: key
    });
}