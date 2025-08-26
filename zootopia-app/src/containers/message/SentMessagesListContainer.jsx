import React, { useState, useEffect, useContext } from 'react';
import { getSentMessages, deleteMessage } from '../../apis/message/messageApi';
import MessageCard from '../../components/message/MessageCard';
import { MessageContext } from '../../context/MessageContextProvider';
import { Pagination, Box } from '@mui/material';
import { Eraser } from 'lucide-react';
import Swal from 'sweetalert2';

function SentMessagesListContainer({ onMessageClick }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);

  // 전역 context에서 페이지 상태와 함수를 가져옴
  const { sentPage, setSentPage, setReceivedPage } = useContext(MessageContext);

  useEffect(() => {
    // 받은 쪽지함의 페이지 번호는 1로 초기화
    setReceivedPage(1);

    const fetchMessages = async () => {
      setLoading(true);
      try {
        // 전역 상태의 sentPage를 사용
        const response = await getSentMessages(sentPage);
        console.log('보낸 쪽지함 API 응답:', response); // 응답 데이터 확인용 로그
        const { messageList, pageInfo: newPageInfo } = response;
        setMessages(messageList || []);
        setPageInfo(newPageInfo || null);
      } catch (err) {
        setError('보낸 쪽지 목록을 불러오는 데 실패했습니다.');
        console.error(err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [sentPage, setReceivedPage]); // sentPage 또는 setReceivedPage가 변경될 때마다 실행


    const handleDelete = async (e, messageNo) => {
    e.stopPropagation();
    if (!messageNo) return;
    // const isConfirmed = window.confirm("이 쪽지를 정말 삭제하시겠습니까?\n삭제된 쪽지는 복구할 수 없습니다.");
    Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제된 쪽지는 복구 할 수 없어요!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네, 지울래요",
      cancelButtonText: "앗, 잠시만요",
      willOpen: () => { // 팝업이 열릴 때 실행되는 콜백 함수, 스윗얼럿 팝업이 자꾸 다른거 뒤에 나와서 직접 z-index 조절
      const popup = Swal.getPopup();
      const container = document.querySelector('.swal2-container');
      if (container) container.style.zIndex = '9999';
      if (popup) popup.style.zIndex = '10000';
    }
    }).then(async (result) => {  // 여기 async 추가!!
      if (result.isConfirmed) {
        try {
          const response = await deleteMessage(messageNo);
          setMessages(currentMessages => currentMessages.filter(msg => msg.messageNo !== messageNo));
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
        } catch (err) {
          alert(err.response?.data || '쪽지 삭제에 실패했습니다.');
        }
      }
    });
  };



  const handlePageChange = (event, value) => {
    // 전역 페이지 상태를 업데이트
    setSentPage(value);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* <h2>보낸 쪽지 목록</h2> */}
      {messages.length === 0 ? (
        <p>보낸 쪽지가 없습니다.</p>
      ) : (
        <>
          {messages.map((msg) => (
            <div key={msg.messageNo} className='tw:flex'>
              <div key={msg.messageNo} onClick={() => onMessageClick(msg.messageNo)} className='tw:w-full'>
                <MessageCard message={msg} />
              </div>
              <button onClick={(e) => handleDelete(e, msg.messageNo)}><Eraser className='tw:text-[#ffd0d0] tw:cursor-pointer tw:h-[117px] tw:ml-1 tw:text-center tw:hover:bg-[#ff8080]' /></button>
            </div>
          ))}
          {pageInfo && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination 
                count={pageInfo.pages}
                page={sentPage} // 전역 상태의 페이지 번호를 사용
                onChange={handlePageChange}
              />
            </Box>
          )}
        </>
      )}
    </div>
  );
}

export default SentMessagesListContainer;