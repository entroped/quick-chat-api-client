import './App.css'
import QuickChatComponent from "./components/QuickChatComponent.tsx";
import {BsChatText} from "react-icons/bs";
import {useState} from "react";

function App() {
    const [active, setActive] = useState(false);

    return (
        <div id='App'>
            <div className='qc-chat-outer'>
                <div className='qc-chat-minimized'>
                    <div className='qc-chat-inner' style={{
                        display: active ? 'block' : 'none'
                    }}>
                        <QuickChatComponent/>
                    </div>
                    <div className='qc-button-container'>
                        <button type='button' onClick={()=>{setActive(!active)}}>
                            <BsChatText/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default App
