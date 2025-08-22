package com.aloha.zootopia.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aloha.zootopia.dto.MessageDTO;
import com.aloha.zootopia.dto.MessageDetailResponseDTO;
import com.aloha.zootopia.dto.MessageResponseDTO;
import com.aloha.zootopia.dto.MessageSentResponseDTO;
import com.aloha.zootopia.mapper.MessageMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class MessageServiceImpl implements MessageService {

    @Autowired private MessageMapper messageMapper;

    @Override
    public void sendMessage(MessageDTO messageDTO) {
        // TODO: 여기서 Mapper를 호출해서 DB에 저장하는 로직이 들어갑니다.
        messageMapper.sendMessage(messageDTO);
        // 일단 데이터가 잘 넘어왔는지 확인하기 위해 출력만 해봅니다.
        System.out.println("서비스에서 받은 데이터: " + messageDTO);

        // messageMapper.insertMessage(messageDTO);
    }

    @Override
    public List<MessageResponseDTO> getReceivedMessages(Long userId, int pageNum, int pageSize) {
        int offset = (pageNum - 1) * pageSize;
        return messageMapper.findReceivedMessagesByUserId(userId, offset, pageSize);
    }

    @Override
    public List<MessageSentResponseDTO> getSentMessages(Long userId, int pageNum, int pageSize) {
        int offset = (pageNum - 1) * pageSize;
        return messageMapper.findSentMessagesByUserId(userId, offset, pageSize);
    }

    @Override
    public int countReceivedMessages(long userId) {
        return messageMapper.countReceivedMessages(userId);
    }

    @Override
    public int countSentMessages(long userId) {
        return messageMapper.countSentMessages(userId);
    }

    @Override
    public MessageDetailResponseDTO getMessageDetails(long messageNo, Long userId) {
        messageMapper.updateReadStatus(messageNo, userId); // 읽음 상태 변경은 그대로 실행
        return messageMapper.findMessageById(messageNo); // 상세 정보 조회 후 반환
    }

    @Override
    @Transactional
    public void deleteMessage(long messageNo, Long userId) throws AccessDeniedException {
        // DB에서 쪽지 정보를 직접 조회하여 sender와 receiver ID를 가져옵니다.
        // 이를 위해 Mapper에 새로운 조회 메소드가 필요합니다.
        MessageDTO message = messageMapper.findMessageForAuth(messageNo);
        log.info("findMessageForAuth 결과: " + message);
        System.out.println("findMessageForAuth 결과: " + message);
        if (message == null) {
            // 쪽지가 존재하지 않는 경우
            throw new IllegalArgumentException("존재하지 않는 쪽지입니다.");
        }
        // --------------------- 여기부터 상대방 쪽지함 안건드리는 삭제
          // 보낸 사람이 삭제를 요청한 경우
        if (message.getSenderId() == userId) {
            messageMapper.updateDeleteStatusBySender(messageNo);
            return; // 작업 종료
        }
        // 받는 사람이 삭제를 요청한 경우
        if (message.getReceiverId() == userId) {
            messageMapper.updateDeleteStatusByReceiver(messageNo);
            return; // 작업 종료
        }
        // 권한이 없는 경우
        throw new AccessDeniedException("쪽지를 삭제할 권한이 없습니다.");
        


        // ------------------------상대방거까지 다지우는 완전삭제 
        // 권한 검사: 현재 로그인한 사용자가 보낸 사람도, 받는 사람도 아닌 경우
        // if (message.getSenderId() != userId && message.getReceiverId() != userId) {
        //     log.info("--- 쪽지 삭제 권한 없음 ---");
        //     System.out.println("--- 쪽지 삭제 권한 없음 ---");
        //     throw new AccessDeniedException("쪽지를 삭제할 권한이 없습니다.");
        // }
        
        // 권한이 있으면 삭제 처리 
        // System.out.println("삭제 실행: messageMapper.deleteMessage 호출");
        // messageMapper.deleteMessage(messageNo);
        // System.out.println("--- MessageService: deleteMessage 정상 종료 ---");
    }


    @Override
    public int getUnreadMessageCount(long userId) {
        return messageMapper.getUnreadMessageCount(userId);
    }
    

    
}
