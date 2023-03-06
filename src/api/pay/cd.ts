import request from '/@/utils/request';

export function useBuyApi(amount?: any) {
	return request({
		url: '/admin/goods/merge/buy',
		method: 'get',
		params: { amount: amount },
	});
}
