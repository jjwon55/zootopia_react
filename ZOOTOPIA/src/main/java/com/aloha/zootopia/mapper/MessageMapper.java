package com.aloha.zootopia.mapper;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.aloha.zootopia.dto.MessageDTO;
import com.aloha.zootopia.dto.MessageDetailResponseDTO;
import com.aloha.zootopia.dto.MessageResponseDTO;
import com.aloha.zootopia.dto.MessageSentResponseDTO;
@Mapper
public interface MessageMapper {
    int sendMessage(MessageDTO messageDTO);
    List<MessageResponseDTO> findReceivedMessagesByUserId(long userId);
    List<MessageSentResponseDTO> findSentMessagesByUserId(long userId);
    MessageDetailResponseDTO findMessageById(long messageNo);
    int updateReadStatus(@Param("messageNo") long messageNo, @Param("userId") long userId);
    // 삭제 권한 확인용: messageNo로 쪽지 정보를 가져옵니다.
    MessageDTO findMessageForAuth(long messageNo);

    // 삭제 실행용: messageNo로 쪽지를 삭제합니다. 완전삭제시 사용하는 메소드
    // int deleteMessage(long messageNo);

    // 상대방 쪽지는 건드리지 않는 삭제
    int updateDeleteStatusBySender(long messageNo);
    int updateDeleteStatusByReceiver(long messageNo);

    // 안읽은 쪽지 카운트
    int getUnreadMessageCount(long userId);
}