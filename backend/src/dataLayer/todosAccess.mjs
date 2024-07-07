import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, UpdateCommand } from '@aws-sdk/lib-dynamodb';
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
    let updateExpression = "set #name = :name, dueDate = :dueDate";
    let expressionAtt = {
        ":name": data.name,
        ":dueDate": data.dueDate
    }
    if (data.attachmentUrl) {
        updateExpression += `, attachmentUrl = :attachmentUrl`;
        expressionAtt[":attachmentUrl"]= data.attachmentUrl;
    }
    if (data.hasOwnProperty('done')) {
        updateExpression += `, done = :done`;
        expressionAtt[":done"]= data.done;
    }
    
    const command = new UpdateCommand({
        TableName: todoTable,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: expressionAtt,
        ReturnValues: "ALL_NEW"
    });

    const rs = await dynamoDbDocument.send(command);
    return rs.Item;
}

export async function deleteTodo(key) {
    await dynamoDbDocument.delete({
        TableName: todoTable,
        Key: key
    });
}

export async function getTodo(key) {
    return await dynamoDbDocument.get({
        TableName: todoTable,
        Key: key
    });
}