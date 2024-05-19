

export interface Environment {
    SERVER_URL: string,
    REQUEST_METHOD: 'POST'|'GET'|'PUT'|'OPTIONS',
    REQUEST_MESSAGE: string,
    REQUEST_FIELDS: string[],
    RESPONSE_MESSAGE: string,
    RESPONSE_FIELDS: string[],
}

export interface GeneralMessageBody {
    [key: string]: string|number|undefined|null
}

export interface NestedObject {
    [key: string|number]: string|number|undefined|null|NestedObject|NestedObject[]
}
