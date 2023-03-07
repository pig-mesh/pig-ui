import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ElMessageBox } from 'element-plus';
import { Session, Local } from '/@/utils/storage';
import qs from 'qs';
import { useMessageBox } from '../hooks/message';

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
	paramsSerializer: {
		serialize(params) {
			return qs.stringify(params, { allowDots: true });
		},
	},
});

// 添加请求拦截器
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// get查询参数序列化
		if (config.method === 'get') {
			// @ts-ignore
			config.paramsSerializer = (params: any) => {
				return qs.stringify(params, { arrayFormat: 'repeat' });
			};
		}
		// 统一增加 token
		const isToken = (config.headers || {}).isToken === false;
		const token = Session.getToken();
		if (token && !isToken) {
			config.headers!['Authorization'] = `Bearer ${token}`;
		}

		// 统一增加租户信息
		if (Local.get('tenantId')) {
			config.headers!['TENANT-ID'] = Local.get('tenantId');
		}

		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(res: any) => {
		if (res.data.code === 1) {
			throw res.data;
		}
		return res.data;
	},
	(error) => {
		const status = Number(error.response.status) || 200;
		if (status === 424) {
			useMessageBox()
				.confirm('令牌状态已过期，请点击重新登录')
				.then(() => {
					Session.clear(); // 清除浏览器全部临时缓存
					window.location.href = '/'; // 去登录页
					return;
				});
		}
		return Promise.reject(error.response.data);
	}
);

// 导出 axios 实例
export default service;
