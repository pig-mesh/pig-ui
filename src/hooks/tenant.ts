import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { fetchList, switchPersonalTenant } from '/@/api/admin/tenant';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useSiteConfig } from '/@/stores/siteConfig';
import { useUserInfo } from '/@/stores/userInfo';
import { Local, Session } from '/@/utils/storage';
import { validateNull } from '/@/utils/validate';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

/**
 * 租户接口定义（统一数据结构）
 */
export interface Tenant {
	id: string; // 租户ID
	name: string; // 租户名称
	tenantDomain?: string; // 租户绑定的域名（用于自动匹配）
	websiteName?: string; // 网站名称（显示在浏览器标题）
	footer?: string; // 页脚信息
	background?: string; // 登录页背景图
	miniQr?: string; // 小程序二维码
}

/**
 * 租户管理 Composable
 *
 * 使用示例:
 * ```ts
 * // 登录页自动匹配租户
 * const { init } = useTenant();
 * onMounted(() => init({ autoMatch: true }));
 *
 * // 手动切换租户（调用API）
 * const { selectTenant } = useTenant();
 * await selectTenant(tenant, { callApi: true });
 * ```
 */
export function useTenant() {
	const { t } = useI18n();

	// ==================== 响应式状态 ====================
	const tenantList = ref<Tenant[]>([]); // 租户列表
	const currentTenantId = ref<string>(''); // 当前选中的租户ID
	const loading = ref(false); // 加载状态

	// ==================== 核心方法 ====================

	/**
	 * 从API获取租户列表
	 * @returns 租户列表数组
	 */
	async function fetchTenantList(): Promise<Tenant[]> {
		loading.value = true;
		try {
			const { data } = await fetchList();
			tenantList.value = data;
			return data;
		} catch (error) {
			useMessage().error(t('tenantSelect.loadError'));
			return [];
		} finally {
			loading.value = false;
		}
	}

	/**
	 * 根据当前域名自动匹配租户
	 * 比较 window.location.host 与租户配置的 tenantDomain
	 * @returns 匹配到的租户，未匹配返回 null
	 */
	function matchTenantByDomain(): Tenant | null {
		const domain = window.location.host;
		return tenantList.value.find((tenant) => !validateNull(tenant.tenantDomain) && domain === tenant.tenantDomain) || null;
	}

	/**
	 * 应用租户主题配置
	 * 设置全局标题、页脚、背景图、小程序二维码等
	 * @param tenant 要应用的租户
	 */
	function applyTenantTheme(tenant: Tenant) {
		const stores = useThemeConfig();
		const { themeConfig } = storeToRefs(stores);

		// 设置主题配置
		const siteConfigStore = useSiteConfig();
		siteConfigStore.siteConfig.title = tenant.websiteName || tenant.name || import.meta.env.VITE_GLOBAL_TITLE;
		siteConfigStore.siteConfig.footer = tenant.footer || import.meta.env.VITE_FOOTER_TITLE;
		themeConfig.value.background = tenant.background || '';
		themeConfig.value.miniQr = tenant.miniQr || '';

		// 持久化主题配置到本地存储
		Local.remove('themeConfig');
		Local.set('themeConfig', themeConfig.value);
	}

	/**
	 * 选择/切换租户
	 * @param tenant 目标租户
	 * @param options.callApi 是否调用后端API（切换租户时需要，初始选择时不需要）
	 * @param options.reload 切换后是否刷新页面（默认true）
	 */
	async function selectTenant(tenant: Tenant, options?: { callApi?: boolean; reload?: boolean }) {
		const { callApi = false, reload = true } = options || {};

		// 如果需要调用API（用于切换租户场景）
		if (callApi) {
			await switchPersonalTenant(tenant.id);
		}

		// 更新用户信息Store（内部会同步写入 Session/Local/Cookies）
		const userInfoStore = useUserInfo();
		userInfoStore.updateTenantInfo(tenant.id, tenant.name);

		// 应用租户主题
		applyTenantTheme(tenant);

		// 显示切换成功提示
		if (callApi) {
			useMessage().success(t('tenantSelector.switchSuccess'));
		}

		// 刷新页面以应用新租户配置
		if (reload) {
			window.location.reload();
		}
	}

	/**
	 * 初始化租户
	 * 流程: 获取列表 → 自动匹配域名（可选）→ 应用主题
	 * @param options.autoMatch 是否根据当前域名自动匹配租户
	 */
	async function init(options?: { autoMatch?: boolean }) {
		const { autoMatch = false } = options || {};

		// 1. 获取租户列表
		await fetchTenantList();

		// 2. 从本地存储读取当前租户ID
		currentTenantId.value = Session.getTenant() || '';

		// 3. 如果启用自动匹配，检查域名是否匹配某个租户
		if (autoMatch) {
			const matched = matchTenantByDomain();
			// 如果匹配到租户且与当前租户不同，则切换
			if (matched && matched.id !== currentTenantId.value) {
				await selectTenant(matched, { reload: true });
				return; // 页面将刷新，后续代码不执行
			}
		}

		// 4. 应用当前租户的主题配置（不刷新页面）
		const current = tenantList.value.find((tenant) => tenant.id === currentTenantId.value);
		if (current) {
			applyTenantTheme(current);
		}
	}

	/**
	 * 根据ID获取租户信息
	 * @param id 租户ID
	 * @returns 租户对象，未找到返回 undefined
	 */
	function getTenantById(id: string): Tenant | undefined {
		return tenantList.value.find((tenant) => tenant.id === id);
	}

	// ==================== 返回 ====================
	return {
		// 状态
		tenantList, // 租户列表
		currentTenantId, // 当前租户ID
		loading, // 加载状态

		// 方法
		fetchTenantList, // 获取租户列表
		matchTenantByDomain, // 按域名匹配租户
		applyTenantTheme, // 应用租户主题
		selectTenant, // 选择/切换租户
		init, // 初始化
		getTenantById, // 根据ID获取租户
	};
}
