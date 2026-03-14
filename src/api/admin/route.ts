import request from '/@/utils/request';

/**
 * 获取路由配置列表
 * @description 根据查询条件获取路由配置列表
 * @param {Object} [query] - 查询参数
 * @returns {Promise} API响应
 */
export const fetchList = (query?: Object) => {
	return request({
		url: '/admin/route',
		method: 'get',
		params: query,
	});
};

/**
 * 新增或更新路由配置
 * @description 提交路由配置数据到服务器
 * @param {object} [obj] - 路由配置对象
 * @returns {Promise} API响应
 */
export const addObj = (obj?: object) => {
	return request({
		url: '/admin/route',
		method: 'post',
		data: obj,
	});
};

/**
 * 删除路由配置
 * @description 根据路由ID删除路由配置
 * @param {string} [routeId] - 路由ID
 * @returns {Promise} API响应
 */
export const deleteObj = (routeId?: string) => {
	return request({
		url: '/admin/route/' + routeId,
		method: 'delete',
	});
};

/**
 * 校验路由配置是否已存在
 * @description 用于表单校验,检查路由ID是否重复
 * @param {any} rule - 校验规则
 * @param {any} value - 待校验的值
 * @param {any} callback - 校验回调函数
 * @param {boolean} isEdit - 是否为编辑模式
 */
export async function validateExist(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	try {
		const { data } = await fetchList({ [rule.field]: value });
		if (data !== null && data.length > 0) {
			callback(new Error('数据已经存在'));
		} else {
			callback();
		}
	} catch (error) {
		callback(error);
	}
}
