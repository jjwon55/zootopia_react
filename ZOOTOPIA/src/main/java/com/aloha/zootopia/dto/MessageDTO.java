package com.aloha.zootopia.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MessageDTO {
    private long senderId;
    private long receiverId;
    private String content;
        // 필요에 따라 message_no, send_time 등 다른 필드도 추가할 수 있습니다.
}
