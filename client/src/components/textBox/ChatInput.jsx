import styled from "styled-components";

const InputContainer = styled.div`
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 95%;
  min-height: 40px;
  padding: 8px;
  border-radius: 100px;
  border: 1px solid rgba(240, 240, 240);
  background-color: #f5f5f5;
  box-shadow: none;
  margin-left: -20px;
  margin-bottom: -6px;
  opacity: 0.5;
  cursor: not-allowed;
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding: 0 4px 0 8px;
`;

const TextArea = styled.textarea`
  height: 40px;
  min-height: 40px;
  box-sizing: border-box;
  max-height: 100px;
  flex: 1;
  border: none;
  background-color: transparent;
  font-size: 16px;
  font-family: "Pretendard";
  resize: none;
  overflow-y: auto;

  line-height: 20px;
  padding: 10px 8px;
  margin: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #999;
  }
`;

const AttachButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  cursor: not-allowed;
  color: #bbb;
  flex-shrink: 0;
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #c0c0c0;
  cursor: not-allowed;
  flex-shrink: 0;
`;

function ChatInput() {
  return (
    <InputContainer>
      <InputRow>
        <AttachButton type="button" disabled>
          <span className="material-symbols-outlined" style={{ fontSize: 22, userSelect: "none" }}>
            attach_file
          </span>
        </AttachButton>
        <TextArea placeholder="메세지 입력하기" disabled rows={1} />
        <SendButton disabled>
          <span className="material-symbols-outlined md-white md-24" style={{ userSelect: "none" }}>
            arrow_upward
          </span>
        </SendButton>
      </InputRow>
    </InputContainer>
  );
}

export default ChatInput;
