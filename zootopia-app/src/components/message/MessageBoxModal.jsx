import React, { useState } from 'react';
import MessageBaseModal from './MessageBaseModal';
import { Box, Tabs, Tab } from '@mui/material';
import ReceivedMessagesListContainer from '../../containers/message/ReceivedMessagesListContainer';
import MessageDetailContainer from '../../containers/message/MessageDetailContainer';

import SentMessagesListContainer from '../../containers/message/SentMessagesListContainer';
import { MailOpen, MessageSquareText } from 'lucide-react';

// TabPanel 컴포넌트 (MUI 문서에서 가져온 기본 구조)
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`message-tabpanel-${index}`}
      aria-labelledby={`message-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

/**
 * 쪽지함 전체를 관리하는 모달 (받은/보낸/상세)
 * @param {object} props
 * @param {boolean} props.open - 모달 열림 상태
 * @param {function} props.onClose - 모달을 닫는 함수
 * @param {function} props.onReply - 답장하기 클릭 시 실행될 함수
 */
const MessageBoxModal = ({ open, onClose, onReply }) => {
  const [currentTab, setCurrentTab] = useState(0); // 0: 받은 쪽지함, 1: 보낸 쪽지함
  const [view, setView] = useState('list'); // 'list' 또는 'detail'
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  const handleTabChange = (event, newValue) => {
    setView('list'); // 탭 변경 시 항상 목록 뷰로 돌아감
    setCurrentTab(newValue);
  };

  const handleMessageClick = (messageNo) => {
    setSelectedMessageId(messageNo);
    setView('detail');
  };

  const handleReturnToList = () => {
    setSelectedMessageId(null);
    setView('list');
  };

  // 모달이 닫힐 때 내부 상태 초기화
  const handleClose = () => {
    handleReturnToList();
    setCurrentTab(0);
    onClose(); // 부모 컴포넌트의 onClose 실행
  };

  // 답장하기 버튼 클릭 시 부모에게 알림
  const handleReply = (recipient) => {
    if (onReply) {
      onReply(recipient);
    }
  };

  // 모달 제목 동적 변경
  const modalTitle = view === 'list' ? <MailOpen className='tw:text-[#ffd0d0]' /> : <MessageSquareText className='tw:text-[#ffd0d0]'/>;

  return (
    <MessageBaseModal open={open} onClose={handleClose} title={modalTitle}>
      {view === 'list' ? (
        // ===== 목록 뷰 =====
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={currentTab} onChange={handleTabChange} aria-label="쪽지함 탭">
              <Tab label="받은 쪽지함" id="message-tab-0" aria-controls="message-tabpanel-0" />
              <Tab label="보낸 쪽지함" id="message-tab-1" aria-controls="message-tabpanel-1" />
            </Tabs>
          </Box>
          <TabPanel value={currentTab} index={0}>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <ReceivedMessagesListContainer onMessageClick={handleMessageClick} />
            </Box>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <SentMessagesListContainer onMessageClick={handleMessageClick} />
            </Box>
          </TabPanel>
        </Box>
      ) : (
        // ===== 상세 뷰 =====
        <MessageDetailContainer
          messageNo={selectedMessageId}
          onReturnToList={handleReturnToList}
          onDeleteSuccess={handleReturnToList}
          onReply={handleReply}
        />
      )}
    </MessageBaseModal>
  );
};

export default MessageBoxModal;
