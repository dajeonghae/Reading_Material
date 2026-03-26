import styled from "styled-components";

const InputContainer = styled.div`
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 95%;
  min-height: 40px;
  padding: 8px;

  border-radius: ${(props) => (props.$isExpanded || props.$hasFiles ? "20px" : "100px")};
  transition: border-radius 0.2s ease-in-out;

  border: 1px solid rgba(240, 240, 240);
  background-color: #ffffff;
  box-shadow: 0px 8px 24px rgba(149, 157, 165, 0.2);
  margin-left: -20px;
  margin-bottom: -6px;
`;

const FilePreviewArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 4px 8px 8px 8px;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
`;

const ImageThumb = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const PdfPreview = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 8px;
  background-color: #f5f5f5;
  border: 1px solid rgba(0, 0, 0, 0.1);
  max-width: 160px;
`;

const PdfName = styled.span`
  font-size: 12px;
  color: #444;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 110px;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: none;
  background-color: #555;
  color: white;
  font-size: 11px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
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
  cursor: pointer;
  color: #888;
  flex-shrink: 0;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background-color: #373d47;
  cursor: pointer;
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
