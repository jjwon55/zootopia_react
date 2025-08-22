package com.aloha.zootopia.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.zootopia.domain.CustomUser;
import com.aloha.zootopia.dto.MessageDTO;
import com.aloha.zootopia.dto.MessageDetailResponseDTO;
import com.aloha.zootopia.dto.MessageResponseDTO;
import com.aloha.zootopia.dto.MessageSendRequestDTO;
import com.aloha.zootopia.dto.MessageSentResponseDTO;
import com.aloha.zootopia.service.MessageService;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;


    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(
                @RequestBody MessageSendRequestDTO requestDTO,
                @AuthenticationPrincipal CustomUser customUser) {
    
        // Service에게 전달할 DTO를 새로 만든다.
        MessageDTO messageData = new MessageDTO();
        messageData.setSenderId(customUser.getUserId()); // 로그인 정보에서 얻은 senderId
        messageData.setReceiverId(Long.parseLong(requestDTO.getReceiverId())); // 클라이언트가 보낸 receiverId
        messageData.setContent(requestDTO.getContent()); // 클라이언트가 보낸 content
        
        // 모든 정보가 담긴 DTO 하나만 서비스에게 넘겨준다.
        messageService.sendMessage(messageData);

        // 3. 처리가 성공했다고 클라이언트에게 응답합니다.
        return new ResponseEntity<>("쪽지 전송 성공", HttpStatus.OK);
    }

    @GetMapping("/received")
    public ResponseEntity<List<MessageResponseDTO>> getReceivedMessages(
            @AuthenticationPrincipal CustomUser customUser) {
        // 1. 로그인한 사용자의 ID를 가져옵니다.
        long userId = customUser.getUserId();
    
        // 2. Service에게 "이 사용자의 받은 쪽지 목록을 다 줘" 라고 요청합니다.
        List<MessageResponseDTO> messages = messageService.getReceivedMessages(userId);

        // 3. 받은 쪽지 목록(List)을 ResponseEntity에 담아서 클라이언트에게 반환합니다.
        return new ResponseEntity<>(messages, HttpStatus.OK);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<MessageSentResponseDTO>> getSentMessages(
        @AuthenticationPrincipal CustomUser customUser) {
    
        long userId = customUser.getUserId();
        List<MessageSentResponseDTO> sentMessages = messageService.getSentMessages(userId);
        return new ResponseEntity<>(sentMessages, HttpStatus.OK);
    }

    @GetMapping("/{messageNo}")
    public ResponseEntity<MessageDetailResponseDTO> getMessageDetail(
                    @PathVariable("messageNo") long messageNo,
                    @AuthenticationPrincipal CustomUser customUser) {    // 로그인 정보
        // 로그인한 사용자의 ID를 가져옵니다.
        long userId = customUser.getUserId();
        
        // Service를 호출할 때 messageNo와 함께 userId도 넘겨줍니다.
        MessageDetailResponseDTO message = messageService.getMessageDetails(messageNo, userId);
        return new ResponseEntity<>(message, HttpStatus.OK);
    }
    
    @DeleteMapping("/{messageNo}")
    public ResponseEntity<String> deleteMessage(
                @PathVariable("messageNo") long messageNo,
                @AuthenticationPrincipal CustomUser customUser) {
        
        log.info("### MessageController: deleteMessage 진입 ###");
    try {
        Long userId = customUser.getUserId();
        System.out.println("messageNo: " + messageNo + ", userId: " + userId);

        // 2. userId가 null인지 확인하는 방어 코드
        if (userId == null) {
            log.info("### Exception 발생: customUser.getUserId()가 null입니다. ###");
            throw new IllegalStateException("사용자 ID를 가져올 수 없습니다. 인증 정보가 완전하지 않습니다.");
        }
            messageService.deleteMessage(messageNo, userId);
            return new ResponseEntity<>("쪽지가 성공적으로 삭제되었습니다.", HttpStatus.OK);
            
        } catch (AccessDeniedException e) {
            log.info("### AccessDeniedException 발생 ###");
            return new ResponseEntity<>(e.getMessage(), HttpStatus.FORBIDDEN);  // 403 forbidden

        } catch (Exception e) {
            log.info("### Exception 발생 ###");
            return new ResponseEntity<>("쪽지 삭제 중 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getUnreadMessageCount(@AuthenticationPrincipal CustomUser customUser) {
        if (customUser == null) {
            // 로그인하지 않은 사용자는 0을 반환
            return new ResponseEntity<>(0, HttpStatus.OK);
        }
        Long userId = customUser.getUserId();
        if (userId == null) {
            return new ResponseEntity<>(0, HttpStatus.OK);
        }
        int unreadCount = messageService.getUnreadMessageCount(userId);
        return new ResponseEntity<>(unreadCount, HttpStatus.OK);
    }


}