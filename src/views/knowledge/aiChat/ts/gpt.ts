import type {ChatMessage} from "/@/views/knowledge/aiChat/ts/index";
import request from "/@/utils/request";


export const chat = (messageList: ChatMessage[]) => {
    return request({
        url: '/knowledge/chat/msg/list',
        method: 'post',
        data: messageList,
        timeout: 120 * 1000, // 设置超时时间为 120 秒
    });
};
