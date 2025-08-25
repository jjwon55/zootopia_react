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

    // 페이지네이션을 위한 목록 조회
    List<MessageResponseDTO> findReceivedMessagesByUserId(@Param("userId") long userId, @Param("offset") int offset, @Param("pageSize") int pageSize);
    List<MessageSentResponseDTO> findSentMessagesByUserId(@Param("userId") long userId, @Param("offset") int offset, @Param("pageSize") int pageSize);

    // 페이지네이션을 위한 개수 조회
    int countReceivedMessages(long userId);
    int countSentMessages(long userId);

    MessageDetailResponseDTO findMessageById(long messageNo);
    int updateReadStatus(@Param("messageNo") long messageNo, @Param("userId") long userId);
    
    // 삭제 권한 확인용
    MessageDTO findMessageForAuth(long messageNo);

    // 상대방 쪽지는 건드리지 않는 삭제
    int updateDeleteStatusBySender(long messageNo);
    int updateDeleteStatusByReceiver(long messageNo);

    // 안읽은 쪽지 카운트
    int getUnreadMessageCount(long userId);
}