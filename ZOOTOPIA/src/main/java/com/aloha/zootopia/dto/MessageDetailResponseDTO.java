package com.aloha.zootopia.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDetailResponseDTO {
    private long messageNo;
    private String senderNickname;
    private String receiverNickname;
    private String content;
    private Date sendTime;
    private Long senderId; // 답장하기에 답장할 정보 자동입력하려고 추가.
}
