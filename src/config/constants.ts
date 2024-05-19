import {Environment} from "../types/env.ts";

export const environment: Environment = {
    SERVER_URL: 'http://localhost:8080',
    REQUEST_METHOD: 'POST',
    REQUEST_MESSAGE: 'content',
    REQUEST_FIELDS: ['content', 'threadId'],
    RESPONSE_MESSAGE: 'result.content.text.value',
    RESPONSE_FIELDS: ['result', 'threadId', 'status']
};
