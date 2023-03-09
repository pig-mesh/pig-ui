import request from '/@/utils/request';

export function useBuyApi(amount?: any) {
	return request({
		url: '/pay/goods/merge/buy',
		method: 'get',
		params: { amount: amount },
	});
}
