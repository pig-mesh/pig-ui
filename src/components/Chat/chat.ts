import request from "/@/utils/request";

export const turbo = (content: string) => {
    return request({
        url: '/knowledge/chat/msg',
        method: 'post',
        data: {content: content},
    });
};
