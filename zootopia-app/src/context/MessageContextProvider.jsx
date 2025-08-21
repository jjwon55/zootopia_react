import React, { createContext, useState, useEffect, useContext } from 'react';
import { getUnreadMessageCount } from '../apis/message/messageApi';
import { LoginContext } from './LoginContextProvider'; // LoginContext를 임포트
export const MessageContext = createContext();




const MessageContextProvider = ({ children }) => {

    const [unreadCount, setUnreadCount] = useState(0);
    // LoginContext의 로그인 상태(isLogin)를 가져옴
    const { isLogin } = useContext(LoginContext);
    // 안 읽은 쪽지 개수를 가져오는 함수
    
    const fetchUnreadCount = async () => {
        // 로그인 상태일 때만 API를 호출
        if (isLogin) {
        const count = await getUnreadMessageCount();
        setUnreadCount(count);
        }
    };


    // isLogin 상태가 변경될 때마다 실행
    useEffect(() => {
        if (isLogin) {
        // 로그인 상태가 되면, 쪽지 개수를 가져옴
        fetchUnreadCount();
        } else {
        // 로그아웃 상태가 되면, 0으로 초기화
        setUnreadCount(0);
        }
    }, [isLogin]); // isLogin이 바뀔 때마다 이 effect가 다시 실행됨

    
    return (
        <MessageContext.Provider value={{ unreadCount, fetchUnreadCount }}>
        {children}
        </MessageContext.Provider>
    );
};
export default MessageContextProvider;