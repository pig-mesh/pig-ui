import request from '/@/utils/request';

// 查询用户首页数据看板
export function queryTaskData(){
	return request({
		url: '/task/task/queryTaskData',
		method: 'get'
	});
}

// 查询抄送详细信息
export function queryMineCCDetail(param: any) {
	return request({
		url: '/task/processCopy/querySingleDetail',
		method: 'get',
		params: param,
	});
}

/**
 * 抄送给我的
 *
 * @param data
 */
export function queryMineCC(data: any) {
	return request({
		url: '/task/process-instance/queryMineCC',
		method: 'post',
		data: data,
	});
}

/**
 * 查询待办任务
 *
 * @param data
 */
export function queryMineTask(data: any) {
	return request({
		url: '/task/process-instance/queryMineTask',
		method: 'post',
		data: data,
	});
}

// 结束流程
export function stopProcessInstance(param: any) {
	return request({
		url: '/task/task/stopProcessInstance',
		method: 'post',
		data: param,
	});
}

/**
 * 查询我发起的任务
 *
 * @param data
 */
export function queryMineStarted(data: any) {
	return request({
		url: '/task/process-instance/queryMineStarted',
		method: 'post',
		data: data,
	});
}

// 查询当前用户已办任务
export function queryMineEndTask(param) {
	return request({
		url: '/task/process-instance/queryMineEndTask',
		method: 'post',
		data: param,
	});
}

/**
 * 查询任务详细信息
 *
 * @param data
 */
export function queryTask(taskId: string, view: boolean) {
	return request({
		url: '/task/task/queryTask?taskId=' + taskId + '&view=' + view,
		method: 'get',
	});
}


// 完成任务
export function completeTask(param: Object) {
	return request({
		url: '/task/task/completeTask',
		method: 'post',
		data: param,
	});
}

// 格式化流程节点显示
export function formatStartNodeShow(param: Object) {
	return request({
		url: '/task/process-instance/formatStartNodeShow',
		method: 'post',
		data: param,
	});
}
