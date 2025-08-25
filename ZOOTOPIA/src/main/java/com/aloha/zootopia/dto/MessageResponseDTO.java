package com.aloha.zootopia.dto;

import java.util.Date;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageResponseDTO {
        private long messageNo;
        private String senderNickname; // ID 대신 닉네임
        private String content;
        private Date sendTime;
        private int isRead;
}
