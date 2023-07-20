import request from '/@/utils/request';

//  流程详情
export function detail(param: any) {
	return request({
		url: '/task/process-instance/detail',
		method: 'get',
		params: param,
	});
}
