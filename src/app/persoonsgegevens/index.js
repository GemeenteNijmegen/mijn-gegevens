const { ApiClient } = require('@gemeentenijmegen/apiclient');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { persoonsgegevensRequestHandler } = require("./persoonsgegevensRequestHandler");
const { Response } = require('@gemeentenijmegen/apigateway-http/lib/V2/Response');

const dynamoDBClient = new DynamoDBClient();
const apiClient = new ApiClient();

async function init() {
    console.time('init');
    console.timeLog('init', 'start init');
    let promise = apiClient.init();
    console.timeEnd('init');
    return promise;
}

const initPromise = init();

function parseEvent(event) {
    return { 
        'cookies': event?.cookies?.join(';'),
    };
}

exports.handler = async (event, context) => {
    try {
        const params = parseEvent(event);
        await initPromise;
        return await persoonsgegevensRequestHandler(params.cookies, apiClient, dynamoDBClient);
    
    } catch (err) {
        console.debug(err);
        return Response.error(500);
    }
};