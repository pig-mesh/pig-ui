import { param } from '/@/stores/param';
import { getValue } from '/@/api/admin/param';
import { ref } from 'vue';

/**
 * 获取参数数据
 * @function
 * @param {string} paramType - 参数类型
 * @returns {object} - 返回参数数据引用对象
 */
export function useParam(paramType: string) {
	const paramValue = ref('');

	const cachedParams = param().getParam(paramType);
	if (cachedParams) {
		paramValue.value = cachedParams;
	} else {
		getValue(paramType).then(({ data }) => {
			if (data) {
				paramValue.value = data;
				param().setParam(paramType, data);
			}
		});
	}

	return paramValue;
}
