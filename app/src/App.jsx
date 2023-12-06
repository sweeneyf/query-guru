import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput,TypingIndicator } from '@chatscope/chat-ui-kit-react';

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello I am query guru",
      sentTime: "just now",
      sender: "Loki",
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    // const newMessages = [...messages, newMessage];
  
    // setMessages(newMessages);
    // console.log(messages);

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    setIsTyping(true);
    await processMessageToLoki(message);
  };  // end handleSend

  async function processMessageToLoki(message) { // messages is an array of messages
    const chatId = "75967535-2604-4425-bb59-3f5826a86d52";
    const url = `http://localhost:3000/api/v1/chats/${chatId}/messages`;
    const data = {
        content: message
    };

    try {
      const response = await fetch(url, {
          method: 'POST', 
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(" Got a message back from Loki!")
      console.log(result); // Process the response here
      console.log(result.data);
      const newMessage = {
        message: result.data,
        direction: 'incoming',
        sender: "user"
      };
      //const newMessages = [...messages, newMessage]
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setIsTyping(false);
    } catch (error) {
        console.error('There was an error!', error);
    }
    
  } // end processMessageToLoki

  return (
      <div className = "App">
        <div style={{ position:"relative", height: "800px", width: "700px" }}>
          <MainContainer>
            <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Loki is typing" /> : null} >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
              <MessageInput placeholder="Type message here" onSend={handleSend} />        
            </ChatContainer>
          </MainContainer>
        </div>
      </div>

  )
}

export default App
