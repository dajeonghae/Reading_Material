import { GOOGLE_SCRIPT_URL } from '../config/experimentConfig.js';

const KEY = 'experiment_tracking';

const estimateTokens = (text = '') => {
  if (!text) return 0;
  const cjkRegex = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF\u3040-\u30FF\u31F0-\u31FF\u3400-\u9FFF]/g;
  const cjkCount = (text.match(cjkRegex) || []).length;
  const nonCjkCount = text.length - cjkCount;
  return cjkCount + Math.ceil(nonCjkCount / 4);
};

const now = () => new Date().toISOString();

export const initTracking = (participantId) => {
  const existing = getTracking();
  if (existing?.participantId === participantId) return;
  localStorage.setItem(KEY, JSON.stringify({
    participantId,
    loginTime: now(),
    messages: [],
    // 노드/인덱스 클릭 (상세)
    nodeClicks: [],
    indexClicks: [],
    // 컨텍스트 navi 토글
    contextToggles: [],
    // 스크롤
    scroll: { count: 0, totalDistancePx: 0, upCount: 0, downCount: 0 },
    // Ctrl+F
    ctrlFCount: 0,
    // 텍스트 선택
    textSelections: [],
    // 메시지 응답 시간
    responseTimes: [],
    // 탭 포커스/블러
    focusEvents: [],
  }));
};

export const getTracking = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
};

const save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

export const trackMessage = (dialogNumber, userText, assistantText) => {
  const data = getTracking();
  if (!data) return;
  if (data.messages.some((m) => m.dialogNumber === dialogNumber)) return;
  data.messages.push({
    dialogNumber,
    userText,
    userTokens: estimateTokens(userText),
    assistantText: assistantText || '',
    assistantTokens: estimateTokens(assistantText),
  });
  save(data);
};

// 노드 클릭 (그래프)
export const trackNodeInteraction = (nodeId = '', keyword = '') => {
  const data = getTracking();
  if (!data) return;
  if (!data.nodeClicks) data.nodeClicks = [];
  data.nodeClicks.push({ nodeId, keyword, timestamp: now() });
  save(data);
};

// ChatIndex 마커 클릭
export const trackIndexInteraction = (nodeId = '', keyword = '') => {
  const data = getTracking();
  if (!data) return;
  if (!data.indexClicks) data.indexClicks = [];
  data.indexClicks.push({ nodeId, keyword, timestamp: now() });
  save(data);
};

// 컨텍스트 navi 토글 (우클릭 → 추가/제거)
export const trackContextToggle = (nodeId, keyword, action) => {
  const data = getTracking();
  if (!data) return;
  if (!data.contextToggles) data.contextToggles = [];
  data.contextToggles.push({ nodeId, keyword, action, timestamp: now() });
  save(data);
};

// 스크롤
export const trackScroll = (deltaY) => {
  const data = getTracking();
  if (!data) return;
  if (!data.scroll) data.scroll = { count: 0, totalDistancePx: 0, upCount: 0, downCount: 0 };
  data.scroll.count += 1;
  data.scroll.totalDistancePx += Math.abs(deltaY);
  if (deltaY < 0) data.scroll.upCount += 1;
  else data.scroll.downCount += 1;
  save(data);
};

// Ctrl+F
export const trackCtrlF = () => {
  const data = getTracking();
  if (!data) return;
  data.ctrlFCount = (data.ctrlFCount || 0) + 1;
  save(data);
};

// 텍스트 선택 (50자 이상만 기록)
export const trackTextSelection = (selectedText) => {
  const data = getTracking();
  if (!data || !selectedText || selectedText.length < 10) return;
  if (!data.textSelections) data.textSelections = [];
  data.textSelections.push({
    length: selectedText.length,
    preview: selectedText.slice(0, 60),
    timestamp: now(),
  });
  save(data);
};

// 메시지 응답 시간
export const trackResponseTime = (dialogNumber, responseTimeMs) => {
  const data = getTracking();
  if (!data) return;
  if (!data.responseTimes) data.responseTimes = [];
  data.responseTimes.push({ dialogNumber, responseTimeMs, timestamp: now() });
  save(data);
};

// 탭 포커스/블러
export const trackFocusEvent = (type) => {
  const data = getTracking();
  if (!data) return;
  if (!data.focusEvents) data.focusEvents = [];
  data.focusEvents.push({ type, timestamp: now() });
  save(data);
};

export const clearTracking = () => {
  localStorage.removeItem(KEY);
};

const saveLocalJson = (payload) => {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `experiment_${payload.participantId}_${payload.endTime.replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const submitExperimentData = async () => {
  const data = getTracking();
  if (!data) return;

  const payload = {
    ...data,
    endTime: now(),
  };

  saveLocalJson(payload);

  console.log('[tracking] 전송할 데이터:', payload);
  if (GOOGLE_SCRIPT_URL) {
    try {
      console.log('[tracking] Google Sheets 전송 시작...');
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });
      console.log('[tracking] 전송 완료');
    } catch (err) {
      console.error('[tracking] Google Sheets 전송 실패:', err);
    }
  } else {
    console.warn('[tracking] GOOGLE_SCRIPT_URL이 설정되지 않았습니다.');
  }
};
