package com.aloha.zootopia.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageSendRequestDTO {
    private String receiverId;
    private String content;
}
