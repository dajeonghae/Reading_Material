import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { loadSnapshotThunk } from '../utils/snapshotManager.js';
import DialogPair from '../components/textBox/DialogPair.jsx';
import ChatInput from '../components/textBox/ChatInput.jsx';

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
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messageRefs = useRef([]);
  const dispatch = useDispatch();

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

        <ChatInputWrapper>
          <ChatInput />
        </ChatInputWrapper>
      </InnerWrapper>
    </Container>
  );
}

export default ChatOnly;
