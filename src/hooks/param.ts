import {param} from '/@/stores/param';
import {getValue} from '/@/api/admin/param';

/**
 * 获取参数数据
 * @function
 * @param {string} args - 参数类型
 * @returns {Object} - 返回参数数据
 */
export function useParam(...args: any): string {
    let res = '';

    for (const paramType of args) {
        const params = param().getParam(paramType);
        if (params) {
            res = params;
        } else {
            // 这里使用同步的获取值方法
            let data = '';
            const fetchData = async () => {
                const result = await getValue(paramType);
                data = result.data;
            };

            fetchData().then(() => {
                if (data) {
                    res = data;
                    param().setParam(paramType, data);
                }
            })
        }
    }

    return res;
}
