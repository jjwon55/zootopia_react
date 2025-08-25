import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// 모달의 기본적인 스타일을 정의합니다.
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600, // 모달의 너비를 조절할 수 있습니다.
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

/**
 * 재사용 가능한 기본 모달 컴포넌트
 * @param {object} props
 * @param {boolean} props.open - 모달의 열림 상태
 * @param {function} props.onClose - 모달을 닫는 함수
 * @param {React.ReactNode} props.children - 모달 내부에 표시될 컨텐츠
 * @param {string} [props.title] - 모달의 제목
 */
const MessageBaseModal = ({ open, onClose, children, title }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h2 id="modal-modal-title">{title || '쪽지'}</h2>
          <IconButton onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box mt={2} id="modal-modal-description">
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default MessageBaseModal;
