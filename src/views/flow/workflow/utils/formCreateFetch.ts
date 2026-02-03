import FcDesigner from 'form-create-designer';
import { CommonHeaderEnum } from '/@/utils/request';
import { Session } from '/@/utils/storage';

/**
 * 初始化 form-create 的 fetch 拦截器
 * 自动注入 Authorization 和 TENANT-ID headers
 *
 * @example
 * // 在组件或入口文件中调用一次即可
 * import { initFormCreateFetch } from '/@/utils/formCreateFetch';
 * initFormCreateFetch();
 */
export function initFormCreateFetch(): void {
	// 保存原始 fetch 方法
	const globalDesignerFetch = FcDesigner.designerForm.fetch;
	const globalFormCreateFetch = FcDesigner.formCreate.fetch;

	// 重写 designerForm.fetch
	FcDesigner.designerForm.fetch = (config: any) => {
		injectAuthHeaders(config);
		return globalDesignerFetch(config);
	};

	// 重写 formCreate.fetch
	FcDesigner.formCreate.fetch = (config: any) => {
		injectAuthHeaders(config);
		return globalFormCreateFetch(config);
	};
}

/**
 * 注入认证 headers 到请求配置
 */
function injectAuthHeaders(config: any): void {
	const token = Session.getToken();
	const tenantId = Session.getTenant();

	config.headers = {
		...config.headers,
		...(token && { [CommonHeaderEnum.AUTHORIZATION]: `Bearer ${token}` }),
		...(tenantId && { [CommonHeaderEnum.TENANT_ID]: tenantId }),
	};
}
