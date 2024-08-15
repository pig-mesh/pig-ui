import request from "/@/utils/request";

export const turbo = (content: string) => {
    return request({
        url: '/admin/chat/msg',
        method: 'post',
        data: {content: content},
    });
};
