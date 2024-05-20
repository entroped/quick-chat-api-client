import {useEffect, useMemo, useRef, useState} from "react";
import {ChatMessage} from "../types/chat.ts";
import './QuickChatComponent.css';
import {BsArrowRepeat, BsFillSendFill} from "react-icons/bs";
import MessageService from "../services/MessageService.ts";
import {environment} from "../config/constants.ts";


export default function QuickChatComponent() {

    const messageClient = useMemo<MessageService>(()=>new MessageService(environment), []);

    const [messages, setMessages] = useState<ChatMessage[]>(messageClient.messages);
    const [pendingMessage, setPendingMessage] = useState('');
    const inputRef = useRef<null|HTMLDivElement>(null);


    const scrollBottom = ()=> {
        const lastMsgNode = document.querySelector('.qc-chat-mg:last-child');
        if (lastMsgNode) {
            lastMsgNode.scrollIntoView({behavior: 'smooth'});
        }
    }
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
            return (<div className='m-1'>There is no messages</div>)
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


    const sendMessage = async ()=> {
        if (inputRef.current && inputRef.current?.innerText) {
            const messageToSend = (inputRef.current.innerText || '')
                .trim().replace(/\n$/g, '');
            inputRef.current.innerHTML = '';
            setPendingMessage(messageToSend);
            const serverMessages = await messageClient.sendMessage(messageToSend);
            setPendingMessage('');
            setMessages(serverMessages);
        }
    }

    const onKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && !pendingMessage) {
            event.preventDefault();
            void sendMessage();
        }
    };

    useEffect(() => {
        scrollBottom();
    }, [messages]);

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
            {renderMessages(pendingMessage ? [...messages, {message:pendingMessage, user: 'You'}] : messages)}
        </div>
        <div className='qc-chat-inputs'>
            <div className="qc-chat-message-input">
                <div className="qc-chat-content-editor-wrapper">
                    <div className="scrollbar-container">
                        <div ref={inputRef} className="qc-chat-content-editor" contentEditable="true"
                             onKeyUp={(e)=>onKeyUp(e)}
                             data-placeholder="Type message here"></div>
                    </div>
                </div>
                <div className="qc-chat-message-input-tools">
                    <button className="qc-chat-button-send" onClick={()=> !pendingMessage && sendMessage()}>
                        {pendingMessage ?
                            <BsArrowRepeat color='#000' fontSize='1.2em' className={'rotate'} /> :
                            <BsFillSendFill color='#000' fontSize='1.2em' />}
                    </button>
                </div>
            </div>
        </div>
    </div>)
}
