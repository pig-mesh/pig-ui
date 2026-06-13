import Cookies from 'js-cookie';

declare const __NEXT_NAME__: string;
declare const __VERSION__: string;

// 存储键常量
export const STORAGE_KEYS = {
	TOKEN: 'token',
	REFRESH_TOKEN: 'refresh_token',
	DEPT_ID: 'deptId',
} as const;

const LOCAL_STORAGE_KEY_PREFIX = `${__NEXT_NAME__}${__VERSION__}:`;

/**
 * js-cookie 统一包装
 * @description 全局 Cookie 读写统一走此对象，业务代码不直接 import 'js-cookie'，
 * 便于后续统一调整 Cookie 属性（path、expires、secure 等）
 */
export const Cookie = {
	// 写入 Cookie，options 透传 js-cookie 的属性配置
	set(key: string, val: string, options?: object) {
		Cookies.set(key, val, options);
	},
	// 读取 Cookie，不存在时返回 undefined
	get(key: string): string | undefined {
		return Cookies.get(key);
	},
	// 移除 Cookie
	remove(key: string) {
		Cookies.remove(key);
	},
};

/**
 * 判断 key 是否需要同步写入 Cookie
 * @description token、refresh_token、deptId 在写入 sessionStorage 的同时也需要写入 Cookie，
 * 原因是请求拦截器（request.ts）通过 Cookies 读取这些值来注入请求头；
 * 普通 key 仅存 sessionStorage，不需要跨请求访问。
 */
function isCookieBackedSessionKey(key: string) {
	return key === STORAGE_KEYS.TOKEN || key === STORAGE_KEYS.REFRESH_TOKEN || key === STORAGE_KEYS.DEPT_ID;
}

/**
 * 为存储键统一追加应用前缀，localStorage 与 sessionStorage 共用
 * @description 已带前缀的 key 原样返回，避免重复拼接
 */
function setStorageKey(key: string) {
	if (key.startsWith(LOCAL_STORAGE_KEY_PREFIX)) {
		return key;
	}
	return `${LOCAL_STORAGE_KEY_PREFIX}${key}`;
}

/**
 * 安全读取并解析 sessionStorage 中的 JSON 值
 * @description Session.get 和 cookie-backed key 的兜底逻辑共用此函数，
 * 统一处理 undefined、字符串 "null"/"undefined" 及 JSON 解析异常三种异常情况。
 * @param key sessionStorage 键名
 * @returns 解析后的值；键不存在或解析失败时返回 null
 */
function getSessionStorageValue(key: string) {
	let json = <string>window.sessionStorage.getItem(key);
	if (!json || json === 'undefined' || json === 'null') return null;
	try {
		return JSON.parse(json);
	} catch {
		return null;
	}
}

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
	// 查看 v2.4.3版本更新日志
	setKey(key: string) {
		return setStorageKey(key);
	},
	// 设置永久缓存
	set<T>(key: string, val: T) {
		if (val === undefined || val === null) {
			return;
		}
		window.localStorage.setItem(Local.setKey(key), JSON.stringify(val));
	},
	// 获取永久缓存
	get(key: string) {
		let json = <string>window.localStorage.getItem(Local.setKey(key));
		if (!json || json === 'undefined' || json === 'null') return null;
		try {
			return JSON.parse(json);
		} catch {
			return null;
		}
	},
	// 移除永久缓存
	remove(key: string) {
		window.localStorage.removeItem(Local.setKey(key));
	},
	// 移除全部永久缓存
	clear() {
		window.localStorage.clear();
	},
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
	// 与 Local 保持一致的键名前缀规则；Cookie 键保持原名，供网关和请求拦截器按原名读取
	setKey(key: string) {
		return setStorageKey(key);
	},
	// 设置临时缓存
	set(key: string, val: any) {
		if (val === undefined || val === null) {
			return;
		}
		if (isCookieBackedSessionKey(key)) {
			Cookie.set(key, val);
		}
		window.sessionStorage.setItem(Session.setKey(key), JSON.stringify(val));
	},
	// 获取临时缓存
	get(key: string) {
		if (isCookieBackedSessionKey(key)) return Cookie.get(key) || getSessionStorageValue(Session.setKey(key));
		return getSessionStorageValue(Session.setKey(key));
	},
	// 移除临时缓存
	remove(key: string) {
		if (isCookieBackedSessionKey(key)) Cookie.remove(key);
		window.sessionStorage.removeItem(Session.setKey(key));
	},
	// 移除全部临时缓存
	clear() {
		Cookie.remove(STORAGE_KEYS.TOKEN);
		Cookie.remove(STORAGE_KEYS.REFRESH_TOKEN);
		Cookie.remove(STORAGE_KEYS.DEPT_ID);
		window.sessionStorage.clear();
	},
	// 获取当前存储的 token
	getToken() {
		return this.get(STORAGE_KEYS.TOKEN);
	},
	// 获取当前的部门
	getDeptId() {
		return Local.get(STORAGE_KEYS.DEPT_ID) ? Local.get(STORAGE_KEYS.DEPT_ID) : '';
	},
};
