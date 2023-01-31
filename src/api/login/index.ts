import request from '/@/utils/request';

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
// export function useLoginApi() {
// 	return {
// 		signIn: (data: object) => {
// 			return request({
// 				url: '/user/signIn',
// 				method: 'post',
// 				data,
// 			});
// 		},
// 		signOut: (data: object) => {
// 			return request({
// 				url: '/user/signOut',
// 				method: 'post',
// 				data,
// 			});
// 		},
// 	};
// }

/**
 * 登录
 * @param data
 */
export const login = (data: any) => {
	let basicAuth = 'Basic ' + window.btoa('pig:pig')
	return request({
		url: '/admin/oauth2/token',
		method: 'post',
		params: data,
		headers: {
			isToken: false,
			'TENANT-ID': '1',
			'Authorization': basicAuth
		}
	})
}
