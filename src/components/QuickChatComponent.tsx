import {useRef, useState} from "react";
import {ChatMessage} from "../types/chat.ts";
import './QuickChatComponent.css';
import { BsFillSendFill } from "react-icons/bs";


export default function QuickChatComponent() {

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            message: 'Hi, I am QC Chat',
            user: 'Chat'
        },
        {
            message: 'How are you today?',
            user: 'Chat'
        },
        {
            message: 'Hi, i need a little help with something',
            user: 'You'
        },
        {
            message: 'I am happy to assist with anything. What is on your mind?',
            user: 'Chat'
        },
        {
            message: 'Can you point me into the right direction regarding to the contact information for the company?',
            user: 'You'
        },
        {
            message: 'Yes sure, it is https://www.yourwebpage.com/',
            user: 'Chat'
        }
    ]);
    const inputRef = useRef<null|HTMLDivElement>(null);

    const renderMessages = (messages: ChatMessage[]) => {

        const groups = messages
            .reduce((groups, message) => {
            const currentGroup = groups[groups.length - 1];
            if (currentGroup && currentGroup[0].user === message.user) {
                currentGroup.push(message);
            } else {
                groups.push([message]);
            }
            return groups;
        }, [] as ChatMessage[][]);

        if (!messages.length) {
            return (<div>There is no messages</div>)
        }
        return (
            <div className='qc-chat-message-list'>
            {groups.map((group, groupIndex) =>
                <div className={(group[0].user === 'You' ? 'out' : 'in') + ' qc-chat-mg'} key={'group_'+groupIndex}>
                    <div className='qc-chat-mg-messages'>
                        {group.map((msg, msgIndex) =>
                            <div className='qc-chat-mg-message' key={'message_' + groupIndex + '-' + msgIndex}>
                                <div className='qc-chat-mg-message-content-w'>
                                    <div className='qc-chat-mg-message-content'>
                                        {msg.message}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
        )
    };


    const sendMessage = ()=> {
        if (inputRef.current && inputRef.current?.innerText) {
            console.log(inputRef.current.innerText, messages);
            setMessages((messages) => {
                if (inputRef.current && inputRef.current.innerText) {
                    messages.push({
                        user: 'You',
                        message: inputRef.current.innerText || ''
                    });
                    inputRef.current.innerHTML = '';
                }
                return [...messages];
            });

        }
    }

    return (<div className='qc-chat-container'>
        <div className='qc-chat-header'>
            <div className='qc-chat-avatar'>
                <div className='qc-chat-avatar-w'>
                    <img alt='avatar' src='./images/avatar.png'/>
                    <div className='status'>
                        <div className='status-bullet'></div>
                    </div>
                </div>
            </div>
            <div className='qc-chat-header-content'>
                <div className='qc-chat-header-use-name'>
                    QC Chat
                </div>
            </div>
        </div>
        <div className='qc-chat-messages'>
            {renderMessages(messages)}
        </div>
        <div className='qc-chat-inputs'>
            <div className="qc-chat-message-input">
                <div className="qc-chat-content-editor-wrapper">
                    <div className="scrollbar-container">
                        <div ref={inputRef} className="qc-chat-content-editor" contentEditable="true"
                             data-placeholder="Type message here"></div>
                    </div>
                </div>
                <div className="qc-chat-message-input-tools">
                    <button className="qc-chat-button-send" onClick={sendMessage}>
                        <BsFillSendFill color='#fff' fontSize='1.2em' />
                    </button>
                </div>
            </div>
        </div>
    </div>)
}
