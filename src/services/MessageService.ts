import {Environment, GeneralMessageBody} from "../types/env.ts";
import {ChatMessage} from "../types/chat.ts";
import {getAllValuesByPath} from "../utils.ts";


class MessageService {
    environment: Environment;
    messages: ChatMessage[];
    private body: GeneralMessageBody;
    constructor(environment: Environment) {
        this.environment = environment;
        this.messages = [];
        this.body = {};
    }


    async sendMessage(message: string) {
        const body = {...this.body, [this.environment.REQUEST_MESSAGE]: message};

        const request = await fetch(this.environment.SERVER_URL + '/', {
            mode: 'cors',
            method: this.environment.REQUEST_METHOD || 'POST',
            body: JSON.stringify(body),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (request.ok) {
            const response = await request.json();
            if (response) {
                const messages = getAllValuesByPath(response, this.environment.RESPONSE_MESSAGE) as string[];
                if (messages && Array.isArray(messages)) {
                    let type = 'You';

                    this.messages = messages.map(message => {
                        const chatMessage:ChatMessage = {
                            message: message,
                            user: type
                        };
                        type = type === 'assistant' ? 'You' : 'assistant';
                        return chatMessage;
                    });
                }
                this.environment.RESPONSE_FIELDS.forEach(rField => {
                    if (response[rField] && this.environment.REQUEST_FIELDS.includes(rField)) {
                        this.body[rField] = response[rField];
                    }
                });
            }
        }
        return this.messages;
    }
}

export default MessageService;
