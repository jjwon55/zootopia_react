package com.aloha.zootopia.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageSentResponseDTO {
    private long messageNo;
    private String receiverNickname; // 받는 사람 닉네임
    private String content;
    private Date sendTime;
    private int isRead; // 상대방 읽음 여부
}
