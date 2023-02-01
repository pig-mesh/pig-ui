import request from "/@/utils/request";


export const getDicts = (type: String) => {
    return request({
        url: `/admin/dict/type/${type}`,
        method: "get",
    })
}
