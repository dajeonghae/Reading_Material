import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessageToApi } from '../services/chatbotService.js';
import { loadSnapshotThunk } from '../utils/snapshotManager.js';
import DialogPair from '../components/textBox/DialogPair.jsx';
import ChatInput from '../components/textBox/ChatInput.jsx';
import { trackMessage } from '../services/trackingService.js';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
`;

const InnerWrapper = styled.div`
  width: 100%;
  max-width: 860px;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 20px 30px 70px 30px;
  box-sizing: border-box;
`;

const ChatInputWrapper = styled.div`
  margin-left: 15px;
  width: calc(100% - 0px);
`;

const MessagesContainer = styled.div`
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow-y: auto;
  scrollbar-width: none;
`;


function ChatOnly() {
  const [messages, setMessages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('experiment_messages_chatonly')) || []; }
    catch { return []; }
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const messageRefs = useRef([]);
  const textareaRef = useRef(null);

  const dispatch = useDispatch();
  const activeNodeIds = useSelector((state) => state.node.activeNodeIds);
  const currentNodeId = activeNodeIds[activeNodeIds.length - 1] || 'root';

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const r = await fetch('/Reading_Material/chatgraph.json');
        const snap = await r.json();
        if (!snap) return;
        const { messages: restored } = await dispatch(loadSnapshotThunk(snap));
        setMessages(restored || []);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 0);
      } catch (e) {
        console.error('chatgraph.json 로드 실패:', e);
      }
    };
    loadInitial();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem('experiment_messages_chatonly', JSON.stringify(messages));
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    setIsLoading(true);

    const userMessage = {
      role: 'user',
      content: input,
      nodeId: currentNodeId,
      number: messages.length + 1,
    };

    let updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setInput('');
    setIsExpanded(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
    }

    try {
      const gptMessageContent = await dispatch(sendMessageToApi(input, updatedMessages));
      const gptMessage = {
        role: 'assistant',
        content: gptMessageContent,
        nodeId: currentNodeId,
        number: updatedMessages.length + 1,
      };

      updatedMessages = [...updatedMessages, gptMessage];
      setMessages(updatedMessages);
      trackMessage(Math.ceil(userMessage.number / 2), input, gptMessageContent);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) return;
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);

    e.target.style.height = '40px';
    const currentScrollHeight = e.target.scrollHeight;

    if (currentScrollHeight > 45) {
      setIsExpanded(true);
      e.target.style.height = `${currentScrollHeight}px`;
    } else {
      setIsExpanded(false);
      e.target.style.height = '40px';
    }
  };

  const pairedMessages = [];
  for (let i = 0; i < messages.length; i += 2) {
    pairedMessages.push({
      userMsg: messages[i],
      aiMsg: messages[i + 1],
      userIndex: i,
      aiIndex: i + 1,
    });
  }

  return (
    <Container>
      <InnerWrapper>
      <MessagesContainer>
        {pairedMessages.map((pair, index) => (
          <DialogPair
            key={index}
            userMsg={pair.userMsg}
            aiMsg={pair.aiMsg}
            userRef={(el) => { messageRefs.current[pair.userIndex] = el; }}
            aiRef={(el) => { if (pair.aiMsg) messageRefs.current[pair.aiIndex] = el; }}
          />
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* <TopButtonContainer>
        <ExportButton onClick={handleExportSnapshot}>Export</ExportButton>
        <ImportButton onClick={handleLoadFromServer}>Import</ImportButton>
        <input
          type="file"
          ref={fileInputRef}
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImportSnapshot}
        />
      </TopButtonContainer> */}

      <ChatInputWrapper>
        <ChatInput
          input={input}
          isLoading={isLoading}
          isExpanded={isExpanded}
          textareaRef={textareaRef}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onSend={handleSend}
        />
      </ChatInputWrapper>
      </InnerWrapper>
    </Container>
  );
}

export default ChatOnly;
