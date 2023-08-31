import { nextTick, defineAsyncComponent } from 'vue';
import type { App } from 'vue';
import * as svg from '@element-plus/icons-vue';
import router from '/@/router/index';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { i18n } from '/@/i18n/index';
import { Local } from '/@/utils/storage';
import { verifyUrl } from '/@/utils/toolsValidate';
import request from '/@/utils/request';
import { useMessage } from '/@/hooks/message';
// @ts-ignore
import * as CryptoJS from 'crypto-js';
import {sm4} from 'sm-crypto'
import { validateNull } from './validate';

// 引入组件
const SvgIcon = defineAsyncComponent(() => import('/@/components/SvgIcon/index.vue'));

/**
 * 导出全局注册 element plus svg 图标
 * @param app vue 实例
 * @description 使用：https://element-plus.gitee.io/zh-CN/component/icon.html
 */
export function elSvg(app: App) {
	const icons = svg as any;
	for (const i in icons) {
		app.component(`ele-${icons[i].name}`, icons[i]);
	}
	app.component('SvgIcon', SvgIcon);
}

/**
 * 设置浏览器标题国际化
 * @method const title = useTitle(); ==> title()
 */
export function useTitle() {
	const stores = useThemeConfig(pinia);
	const { themeConfig } = storeToRefs(stores);
	nextTick(() => {
		let globalTitle: string = themeConfig.value.globalTitle;
		let webTitle = setTagsViewNameI18n(router.currentRoute.value);
		document.title = `${webTitle} - ${globalTitle}` || globalTitle;
	});
}

/**
 * 设置 自定义 tagsView 名称、 自定义 tagsView 名称国际化
 * @param params 路由 query、params 中的 tagsViewName
 * @returns 返回当前 tagsViewName 名称
 */
export function setTagsViewNameI18n(item: any) {
	let tagsViewName: string = '';
	const { query, params } = item;
	//修复tagsViewName匹配到其他含下列单词的路由
	const pattern = /^\{("(zh-cn|en|zh-tw)":"[^,]+",?){1,3}}$/;
	if (query?.tagsViewName || params?.tagsViewName) {
		if (pattern.test(query?.tagsViewName) || pattern.test(params?.tagsViewName)) {
			// 国际化
			const urlTagsParams = (query?.tagsViewName && JSON.parse(query?.tagsViewName)) || (params?.tagsViewName && JSON.parse(params?.tagsViewName));
			tagsViewName = urlTagsParams[i18n.global.locale.value];
		} else {
			// 非国际化
			tagsViewName = query?.tagsViewName || params?.tagsViewName;
		}
	} else {
		// 非自定义 tagsView 名称
		tagsViewName = i18n.global.t(item.name);
	}
	return tagsViewName;
}

/**
 * 图片懒加载
 * @param el dom 目标元素
 * @param arr 列表数据
 * @description data-xxx 属性用于存储页面或应用程序的私有自定义数据
 */
export const lazyImg = (el: string, arr: EmptyArrayType) => {
	const io = new IntersectionObserver((res) => {
		res.forEach((v: any) => {
			if (v.isIntersecting) {
				const { img, key } = v.target.dataset;
				v.target.src = img;
				v.target.onload = () => {
					io.unobserve(v.target);
					arr[key]['loading'] = false;
				};
			}
		});
	});
	nextTick(() => {
		document.querySelectorAll(el).forEach((img) => io.observe(img));
	});
};

/**
 * 全局组件大小
 * @returns 返回 `window.localStorage` 中读取的缓存值 `globalComponentSize`
 */
export const globalComponentSize = (): string => {
	const stores = useThemeConfig(pinia);
	const { themeConfig } = storeToRefs(stores);
	return Local.get('themeConfig')?.globalComponentSize || themeConfig.value?.globalComponentSize;
};

/**
 * 对象深克隆
 * @param obj 源对象
 * @returns 克隆后的对象
 */
export function deepClone(obj: EmptyObjectType) {
	let newObj: EmptyObjectType;
	try {
		newObj = obj.push ? [] : {};
	} catch (error) {
		newObj = {};
	}
	for (let attr in obj) {
		if (obj[attr] && typeof obj[attr] === 'object') {
			newObj[attr] = deepClone(obj[attr]);
		} else {
			newObj[attr] = obj[attr];
		}
	}
	return newObj;
}

/**
 * 判断是否是移动端
 */
export function isMobile() {
	if (
		navigator.userAgent.match(
			/('phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone')/i
		)
	) {
		return true;
	} else {
		return false;
	}
}

/**
 * 判断数组对象中所有属性是否为空，为空则删除当前行对象
 * @description @感谢大黄
 * @param list 数组对象
 * @returns 删除空值后的数组对象
 */
export function handleEmpty(list: EmptyArrayType) {
	const arr = [] as any[];
	for (const i in list) {
		const d = [] as any[];
		for (const j in list[i]) {
			d.push(list[i][j]);
		}
		const leng = d.filter((item) => item === '').length;
		if (leng !== d.length) {
			arr.push(list[i]);
		}
	}
	return arr;
}

/**
 * 打开外部链接
 * @param val 当前点击项菜单
 */
export function handleOpenLink(val: RouteItem) {
	router.push(val.path);
	if (verifyUrl(<string>val.meta?.isLink)) window.open(val.meta?.isLink);
	else window.open(`${val.meta?.isLink}`);
}

/**
 * 打开小窗口
 */
export const openWindow = (url: string, title: string, w: number, h: number) => {
	// @ts-ignore
	const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
	// @ts-ignore
	const dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

	const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
	const height = window.innerHeight
		? window.innerHeight
		: document.documentElement.clientHeight
		? document.documentElement.clientHeight
		: screen.height;

	const left = width / 2 - w / 2 + dualScreenLeft;
	const top = height / 2 - h / 2 + dualScreenTop;
	return window.open(
		url,
		title,
		'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=' +
			w +
			', height=' +
			h +
			', top=' +
			top +
			', left=' +
			left
	);
};
/**
 *加密处理
 */
export function encryption(src: string, keyWord: string) {
	const key = CryptoJS.enc.Utf8.parse(keyWord);
	// 加密
	var encrypted = CryptoJS.AES.encrypt(src, key, {
		iv: key,
		mode: CryptoJS.mode.CFB,
		padding: CryptoJS.pad.NoPadding,
	});
	return encrypted.toString();
}

/**
 *  解密
 * @param {*} params 参数列表
 * @returns 明文
 */
export function decryption(src: string, keyWord: string) {
	const key = CryptoJS.enc.Utf8.parse(keyWord);
	// 解密逻辑
	var decryptd = CryptoJS.AES.decrypt(src, key, {
		iv: key,
		mode: CryptoJS.mode.CFB,
		padding: CryptoJS.pad.NoPadding,
	});

	return decryptd.toString(CryptoJS.enc.Utf8);
}

/**
 * SM4加密处理
 */
export function sm4Encryption(src: string, keyWord: string) {
	return sm4.encrypt(src, keyWord);
}

/**
 * SM4解密处理
 * @param {*} params 参数列表
 * @returns 明文
 */
export function sm4Decryption(src: string, keyWord: string) {
	return sm4.decrypt(src, keyWord);
}

/**
 * Base64 加密
 * @param {*} src  明文
 * @returns 密文
 */
export function base64Encrypt(src: string) {
	const encodedWord = CryptoJS.enc.Utf8.parse(src);
	return CryptoJS.enc.Base64.stringify(encodedWord);
}

/**
 *
 * @param url 目标下载接口
 * @param query 查询参数
 * @param fileName 文件名称
 * @returns {*}
 */
export function downBlobFile(url: any, query: any, fileName: string) {
	return request({
		url: url,
		method: 'get',
		responseType: 'blob',
		params: query,
	}).then((response) => {
		handleBlobFile(response, fileName);
	});
}

/**
 * blob 文件刘处理
 * @param response 响应结果
 * @returns
 */
export function handleBlobFile(response: any, fileName: string) {
	// 处理返回的文件流
	const blob = response;
	if (blob && blob.size === 0) {
		useMessage().error('内容为空，无法下载');
		return;
	}
	const link = document.createElement('a');

	// 兼容一下 入参不是 File Blob 类型情况
	var binaryData = [] as any;
	binaryData.push(response);
	link.href = window.URL.createObjectURL(new Blob(binaryData));
	link.download = fileName;
	document.body.appendChild(link);
	link.click();
	window.setTimeout(function () {
		// @ts-ignore
		URL.revokeObjectURL(blob);
		document.body.removeChild(link);
	}, 0);
}

/**
 * @description 生成唯一 uuid
 * @return string
 */
export function generateUUID() {
	if (typeof crypto === 'object') {
		if (typeof crypto.randomUUID === 'function') {
			return crypto.randomUUID();
		}
		if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
			const callback = (c: any) => {
				const num = Number(c);
				return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
			};
			return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, callback);
		}
	}
	let timestamp = new Date().getTime();
	let performanceNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		let random = Math.random() * 16;
		if (timestamp > 0) {
			random = (timestamp + random) % 16 | 0;
			timestamp = Math.floor(timestamp / 16);
		} else {
			random = (performanceNow + random) % 16 | 0;
			performanceNow = Math.floor(performanceNow / 16);
		}
		return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
	});
}
/**
 * 统一批量导出
 * @method elSvg 导出全局注册 element plus svg 图标
 * @method useTitle 设置浏览器标题国际化
 * @method setTagsViewNameI18n 设置 自定义 tagsView 名称、 自定义 tagsView 名称国际化
 * @method lazyImg 图片懒加载
 * @method globalComponentSize() element plus 全局组件大小
 * @method deepClone 对象深克隆
 * @method isMobile 判断是否是移动端
 * @method handleEmpty 判断数组对象中所有属性是否为空，为空则删除当前行对象
 * @method handleOpenLink 打开外部链接
 */
const other = {
	elSvg: (app: App) => {
		elSvg(app);
	},
	useTitle: () => {
		useTitle();
	},
	setTagsViewNameI18n(route: RouteToFrom) {
		return setTagsViewNameI18n(route);
	},
	lazyImg: (el: string, arr: EmptyArrayType) => {
		lazyImg(el, arr);
	},
	globalComponentSize: () => {
		return globalComponentSize();
	},
	deepClone: (obj: EmptyObjectType) => {
		return deepClone(obj);
	},
	isMobile: () => {
		return isMobile();
	},
	handleEmpty: (list: EmptyArrayType) => {
		return handleEmpty(list);
	},
	handleOpenLink: (val: RouteItem) => {
		handleOpenLink(val);
	},
	encryption: (src: string, keyWord: string) => {
		return encryption(src, keyWord);
	},
	decryption: (src: string, keyWord: string) => {
		return decryption(src, keyWord);
	},
	base64Encrypt: (data: any) => {
		return base64Encrypt(data);
	},
	downBlobFile: (url: any, query: any, fileName: string) => {
		return downBlobFile(url, query, fileName);
	},
	toUnderline: (str: string) => {
		return toUnderline(str);
	},
	openWindow: (url: string, title: string, w: number, h: number) => {
		return openWindow(url, title, w, h);
	},
	getQueryString: (url: string, paraName: string) => {
		return getQueryString(url, paraName);
	},
	adaptationUrl: (url?: string) => {
		return adaptationUrl(url);
	},
	resolveAllEunuchNodeId: (json: any[], idArr: any[], temp: any[] = []) => {
		return resolveAllEunuchNodeId(json, idArr, temp);
	},
	getNonDuplicateID: () => {
		return getNonDuplicateID();
	},

	addUnit: (value: string | number, unit = 'px') => {
		return addUnit(value, unit);
	},
	validateNull: (value: any) => {
		return validateNull(value);
	},
};

export function getQueryString(url: string, paraName: string) {
	const arrObj = url.split('?');
	if (arrObj.length > 1) {
		const arrPara = arrObj[1].split('&');
		let arr;
		for (let i = 0; i < arrPara.length; i++) {
			arr = arrPara[i].split('=');
			// eslint-disable-next-line eqeqeq
			if (arr != null && arr[0] == paraName) {
				return arr[1];
			}
		}
		return '';
	} else {
		return '';
	}
}

/**
 * 列表结构转树结构
 * @param data
 * @param id
 * @param parentId
 * @param children
 * @param rootId
 * @returns {*}
 */
export function handleTree(data: any, id: any, parentId: any, children: any, rootId: any) {
	id = id || 'id';
	parentId = parentId || 'parentId';
	children = children || 'children';
	rootId =
		rootId ||
		Math.min.apply(
			Math,
			data.map((item: any) => {
				return item[parentId];
			})
		) ||
		0;
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data));
	//循环所有项
	const treeData = cloneData.filter((father: any) => {
		const branchArr = cloneData.filter((child: any) => {
			//返回每一项的子级数组
			return father[id] === child[parentId];
		});
		branchArr.length > 0 ? (father[children] = branchArr) : '';
		//返回第一层
		return father[parentId] === rootId;
	});
	return treeData !== '' ? treeData : data;
}

/**
 * 解析所有太监节点ID
 * @returns
 */
const resolveAllEunuchNodeId = (json: any[], idArr: any[], temp: any[] = []) => {
	for (const item of json) {
		if (item.children && item.children.length !== 0) {
			resolveAllEunuchNodeId(item.children, idArr, temp);
		} else {
			temp.push(...idArr.filter((id) => id === item.id));
		}
	}
	return temp;
};

/**
 *
 * @param str 驼峰转下划线
 * @returns 下划线
 */
export function toUnderline(str: string) {
	return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * 自动适配不同的后端架构
 * 1. 例如 /act/oa/task ,在微服务架构保持不变,在单体架构编程 /admin/oa/task
 * 2. 特殊 /gen/xxx ,在微服务架构、单体架构编程 都需保持不变
 *
 * @param originUrl 原始路径
 */
const adaptationUrl = (originUrl?: string) => {
	// 微服务架构 不做路径转换,为空不做路径转换
	const isMicro = import.meta.env.VITE_IS_MICRO;
	if (validateNull(isMicro) || isMicro === 'true') {
		return originUrl;
	}

	// 验证码服务
	if (originUrl?.startsWith('/code/')) {
		return `/admin${originUrl}`;
	}

	// 如果是代码生成服务，不做路径转换
	if (originUrl?.startsWith('/gen')) {
		return originUrl;
	}
	// 转为 /admin 路由前缀的请求
	return `/admin/${originUrl?.split('/').splice(2).join('/')}`;
};

/**
 * @description 获取不重复的id
 * @param length { Number } id的长度
 * @return { String } id
 */
const getNonDuplicateID = (length = 8) => {
	let idStr = Date.now().toString(36);
	idStr += Math.random().toString(36).substring(3, length);
	return idStr;
};

/**
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
const addUnit = (value: string | number, unit = 'px') => {
	return !Object.is(Number(value), NaN) ? `${value}${unit}` : value;
};

// 统一批量导出
export default other;
