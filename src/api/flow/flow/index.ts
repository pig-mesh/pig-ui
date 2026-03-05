import request from '/@/utils/request';

/**
 * 创建流程
 *
 * @param data
 */
export function addFlow(data: any) {
	return request({
		url: '/task/process/create',
		method: 'post',
		data: data,
	});
}

/**
 * 获取流程详细信息
 *
 * @param data
 */
export function getFlowDetail(flowId: string) {
	return request({
		url: '/task/process/getDetail',
		method: 'get',
		params: {flowId},
	});
}

/**
 * 停用流程
 *
 * @param data
 */
export function disableFlow(flowId: string) {
	return request({
		url: '/task/process/update/' + flowId + '?type=stop',
		method: 'put',
	});
}

/**
 * 删除流程
 *
 * @param data
 */
export function deleteFlow(flowId: string) {
	return request({
		url: '/task/process/update/' + flowId + '?type=delete',
		method: 'put',
	});
}

/**
 * 启用流程
 *
 * @param data
 */
export function enableFlow(flowId: string) {
	return request({
		url: '/task/process/update/' + flowId + '?type=using',
		method: 'put',
	});
}

/**
 * 发起流程
 *
 * @param data
 */
export function startFlow(obj: any) {
	return request({
		url: '/task/process-instance/startProcessInstance',
		method: 'post',
		data: obj,
	});
}

/**
 * 验证流程ID是否在所有实现类中存在
 *
 * @param flowId 流程ID
 */
export function validateFlowId(flowId: string) {
	return request({
		url: '/task/process/validateFlowId',
		method: 'get',
		params: { flowId },
	});
}

/**
 * 获取流程打印模板
 */
export function getPrintTemplate(flowId: string) {
	return request({
		url: '/task/process/printTemplate/' + flowId,
		method: 'get',
	});
}

/**
 * 保存流程打印模板
 */
export function savePrintTemplate(data: { flowId: string; printTemplate: string }) {
	return request({
		url: '/task/process/printTemplate',
		method: 'put',
		data,
	});
}
