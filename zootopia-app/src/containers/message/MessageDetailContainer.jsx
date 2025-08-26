import React, { useState, useEffect, useContext } from 'react';
import { getMessageDetails, deleteMessage } from '../../apis/message/messageApi'; // 경로 확인
import MessageDetailView from '../../components/message/MessageDetailView'; // 경로 확인
import { MessageContext } from '../../context/MessageContextProvider';
import { List, Send, Trash } from 'lucide-react';
import Swal from 'sweetalert2';
import styles from './MessageDetailContainer.module.css';

function MessageDetailContainer({ messageNo, onReply, onDeleteSuccess, onReturnToList }) {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { fetchUnreadCount } = useContext(MessageContext);

  useEffect(() => {
    if (!messageNo) return;

    const fetchMessage = async () => {
      setLoading(true);
      try {
        const data = await getMessageDetails(messageNo);
        setMessage(data);
        await fetchUnreadCount();
      } catch (err) {
        setError('쪽지 상세 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [messageNo, fetchUnreadCount]);

  const handleReply = () => {
    if (!message || !onReply) return;
    const recipient = {
      userId: message.senderId,
      nickname: message.senderNickname,
    };
    onReply(recipient);
  };

  const handleDelete = async () => {
  if (!messageNo) return;
  // const isConfirmed = window.confirm("이 쪽지를 정말 삭제하시겠습니까?\n삭제된 쪽지는 복구할 수 없습니다.");
  Swal.fire({
    title: "이 쪽지를 정말 삭제하시겠습니까?",
    text: "삭제된 쪽지는 복구 할 수 없습니다.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "네, 지울래요",
    cancelButtonText: "앗, 잠시만요",
    willOpen: () => {
    const popup = Swal.getPopup();
    const container = document.querySelector('.swal2-container');
    if (container) container.style.zIndex = '9999';
    if (popup) popup.style.zIndex = '10000';
  }
  }).then(async (result) => {  // 여기 async 추가!!
    if (result.isConfirmed) {
      try {
        const response = await deleteMessage(messageNo);
        Swal.fire({
          title: response,
          text: "삭제된 쪽지는 복구 못합니다.",
          icon: "success",
          willOpen: () => {
            const popup = Swal.getPopup();
            const container = document.querySelector('.swal2-container');
            if (container) container.style.zIndex = '9999';
            if (popup) popup.style.zIndex = '10000';
          }
        });
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      } catch (err) {
        alert(err.response?.data || '쪽지 삭제에 실패했습니다.');
      }
    }
  });
};


  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (!message) {
    return <div>쪽지 정보가 없습니다.</div>;
  }

  return (
    <div>
      <MessageDetailView message={message} />
      <div className='tw:flex tw:relative'>
        <button onClick={onReturnToList}><List /></button>
        <button onClick={handleReply} className='tw:flex tw:flex-row tw:ml-3'>답장하기</button>
        <button onClick={handleDelete} className='tw:absolute tw:right-0 tw:top-[0px] tw:ml-[10px] tw:text-[#ff4d4d] tw:bg-[#ffffff]'>
          <Trash />
        </button>
      </div>
    </div>
  );
}

export default MessageDetailContainer;
