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
        this.reloadSessionVariables();
    }

    private reloadSessionVariables() {
        if (window.localStorage) {
            try {
                const savedBody = JSON.parse(window.localStorage.getItem('qc_chat_body') || '{}');
                Object.keys(savedBody).forEach(field => {
                    if (savedBody[field] && this.environment.REQUEST_FIELDS.includes(field)) {
                        this.body[field] = savedBody[field];
                    }
                });
            } catch (e) {
                console.error(e);
            }
            try {
                const savedMessages = JSON.parse(window.localStorage.getItem('qc_chat_history') || '[]');
                if (Array.isArray(savedMessages)) {
                    savedMessages.forEach(message=>{
                        if (message.user && message.message) {
                            this.messages.push({
                                user: message.user,
                                message: message.message
                            });
                        }
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    private syncSessionVariables() {
        if (window.localStorage) {
            window.localStorage.setItem('qc_chat_body', JSON.stringify(this.body));
            window.localStorage.setItem('qc_chat_history', JSON.stringify(this.messages));
        }
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
                    if (response[rField] && this.environment.REQUEST_FIELDS.includes(rField) &&
                        response[rField] !== this.body[rField]) {
                        this.body[rField] = response[rField];
                    }
                });
                this.syncSessionVariables();
            }
        }
        return this.messages;
    }
}

export default MessageService;
