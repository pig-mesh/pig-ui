import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Session } from '/@/utils/storage';
import { useMessageBox } from '/@/hooks/message';
import qs from 'qs';
import other from './other';
import { wrapEncryption, encryptRequestParams, decrypt } from './apiCrypto';

// 常用header
export enum CommonHeaderEnum {
	'ENC_FLAG' = 'Enc-Flag',
	'AUTHORIZATION' = 'Authorization',
	'VERSION' = 'VERSION',
}

/**
 * 创建并配置一个 Axios 实例对象
 */
const service: AxiosInstance = axios.create({
	baseURL,
	timeout: Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 50000, // 全局超时时间（可通过.env配置）
	paramsSerializer: {
		serialize: (params: any) => {
			return qs.stringify(params, { arrayFormat: 'repeat' });
		},
	},
});

/**
 * Axios请求拦截器，对请求进行处理
 * 1. 序列化get请求参数
 * 2. 统一增加Authorization请求头
 * 3. 自动适配单体、微服务架构不同的URL
 * @param config AxiosRequestConfig对象，包含请求配置信息
 */
service.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {

		// 统一增加Authorization请求头, skipToken 跳过增加token
		const token = Session.getToken();
		if (token && !config.headers?.skipToken) {
			config.headers![CommonHeaderEnum.AUTHORIZATION] = `Bearer ${token}`;
		}

		// 增加 gray_version 请求头
		const version = import.meta.env.VITE_GRAY_VERSION;
		if (version) {
			config.headers![CommonHeaderEnum.VERSION] = version;
		}

		// 请求报文加密 ，如果请求头中不包含 ENC_FLAG ： false 则加密
		if (config.data && !config.headers![CommonHeaderEnum.ENC_FLAG]) {
			config.data = wrapEncryption(config.data);
		}

		// 如果是 GET ，加密 config.param 的每一个参数，并URLencode
		if (config.method === 'get' && config.params) {
			config.params = encryptRequestParams(config.params);
		}

		// 自动适配单体和微服务架构不同的URL
		config.url = other.adaptationUrl(config.url);

		// 处理完毕，返回config对象
		return config;
	},
	(error) => {
		// 对请求错误进行处理
		return Promise.reject(error);
	}
);

/**
 * 响应拦截器处理函数
 * @param response 响应结果
 * @returns 如果响应成功，则返回响应的data属性；否则，抛出错误或者执行其他操作
 */
const handleResponse = (response: AxiosResponse<any>) => {
	if (response.data.code === 1) {
		throw response.data;
	}

	// 针对密文返回解密
	if (response.data.encryption) {
		response.data = decrypt(response.data.encryption);
		return response.data;
	}

	return response.data;
};

/**
 * 添加 Axios 的响应拦截器，用于全局响应结果处理
 */
service.interceptors.response.use(handleResponse, (error) => {
	const status = Number(error.response.status) || 200;
	if (status === 423) {
		return Promise.reject({ msg: '"演示环境，仅供预览"' });
	}

	if (status === 424) {
		useMessageBox()
			.confirm('令牌状态已过期，请点击重新登录')
			.then(() => {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/'; // 去登录页
				return;
			});
	}

	// 针对密文返回解密
	if (error.response?.data?.encryption) {
		error.response.data = decrypt(error.response?.data.encryption);
	}

	return Promise.reject(error.response.data);
});

// 导出 axios 实例
export default service;
