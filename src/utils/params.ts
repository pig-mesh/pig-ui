import {getObjDetails} from '/@/api/admin/param';

/**
 * 后端参数获取
 */
const params = {
    async get(key: string) {
        const result = await getObjDetails({publicKey: key})
        return result.data;
    },
}

// 统一批量导出
export default params;
