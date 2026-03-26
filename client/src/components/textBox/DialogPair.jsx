import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import DialogBox from './DialogBox'; // 경로 확인 필요

// 전체 컨테이너
const PairContainer = styled.div`
    display: flex;
    flex-direction: row; /* 가로 배치 */
    width: 100%;
    position: relative;
    margin-bottom: 12px; /* 대화 쌍 간의 간격 */
`;

// 1. 왼쪽: 실제 대화 메시지 영역
const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: calc(100% - 70px); /* 타임라인 너비만큼 뺌 */
    padding-right: 15px;      /* 타임라인과 메시지 사이 간격 */
`;

const DialogPair = ({ userMsg, aiMsg, userRef, aiRef }) => {
    const nodes = useSelector((state) => state.node.nodes);

    // Node ID 역추적 로직
    let actualNodeId = userMsg?.nodeId || "root";
    if (nodes) {
        Object.entries(nodes).forEach(([id, node]) => {
            Object.keys(node.dialog || {}).forEach((dialogNumStr) => {
                const dialogNum = Number(dialogNumStr);
                const questionNum = (dialogNum - 1) * 2 + 1;
                // userMsg의 number와 매칭되는 노드 찾기
                if (userMsg?.number === questionNum) {
                    actualNodeId = id;
                }
            });
        });
    }

    return (
        <PairContainer>
            {/* 1. 메시지 영역을 먼저 렌더링 (왼쪽) */}
            <MessagesContainer>
                {/* User 메시지 */}
                {userMsg && (
                    <div ref={userRef} style={{ width: '100%', marginBottom: '4px' }}>
                        <DialogBox
                            text={userMsg.content}
                            isUser={true}
                            nodeId={actualNodeId}
                            number={userMsg.number}
                            attachments={userMsg.attachments}
                        />
                    </div>
                )}
                
                {/* AI 메시지 */}
                {aiMsg && (
                    <div ref={aiRef} style={{ width: '100%' }}>
                        <DialogBox
                            text={aiMsg.content}
                            isUser={false}
                            nodeId={actualNodeId}
                            number={aiMsg.number}
                        />
                    </div>
                )}
            </MessagesContainer>

            {/* 2. 타임라인 영역을 나중에 렌더링 (오른쪽)
            <TimelineContainer>
                <NodeCircle color={activeColor} />
                <NodeBadge color={activeColor}>{actualNodeId}</NodeBadge>
                <VerticalLine color={activeColor} />
            </TimelineContainer> */}
        </PairContainer>
    );
};

export default DialogPair;