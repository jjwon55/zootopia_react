package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;

import com.aloha.zootopia.dto.MessageDTO;
import com.aloha.zootopia.dto.MessageDetailResponseDTO;
import com.aloha.zootopia.dto.MessageResponseDTO;
import com.aloha.zootopia.dto.MessageSentResponseDTO;

public interface MessageService {
    void sendMessage(MessageDTO messageDTO);
    
    // 페이지네이션을 위한 메소드들
    List<MessageResponseDTO> getReceivedMessages(Long userId, int pageNum, int pageSize);
    List<MessageSentResponseDTO> getSentMessages(Long userId, int pageNum, int pageSize);
    int countReceivedMessages(long userId);
    int countSentMessages(long userId);

    MessageDetailResponseDTO getMessageDetails(long messageNo, Long userId);
    void deleteMessage(long messageNo, Long userId) throws AccessDeniedException;
    int getUnreadMessageCount(long userId);     // 안읽은 쪽지 카운트
}
