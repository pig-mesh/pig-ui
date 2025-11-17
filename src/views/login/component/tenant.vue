<template>
	<div v-if="!autoTenantEnable">
		<el-select
			v-model="tenant"
			:placeholder="$t('tenantSelect.select')"
			class="w-full h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200 rounded-md border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
			@change="handleTenantChange"
		>
			<template #prefix>
				<el-icon class="el-input__icon text-gray-400 dark:text-slate-400">
					<ele-OfficeBuilding />
				</el-icon>
			</template>
			<el-option
				v-for="item in tenantList"
				:key="item.id"
				:label="item.name"
				:value="item.id"
			>
				<div class="flex items-center">
					<el-icon class="mr-2 text-gray-400 dark:text-slate-400">
						<ele-OfficeBuilding />
					</el-icon>
					<span>{{ item.name }}</span>
				</div>
			</el-option>
		</el-select>
	</div>
</template>

<script setup lang="ts" name="tenant">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import Cookies from 'js-cookie';
import { fetchList } from '/@/api/admin/tenant';
import { Local, Session, STORAGE_KEYS } from '/@/utils/storage';
import { useThemeConfig } from '/@/stores/themeConfig';
import pinia from '/@/stores';
import { validateNull } from '/@/utils/validate';
import { useMessage } from '/@/hooks/message';

const { t } = useI18n();

// 定义租户接口
interface Tenant {
	id: string;
	name: string;
	tenantDomain?: string;
	websiteName?: string;
	footer?: string;
	background?: string;
	miniQr?: string;
}

// 是否启用自动租户选择
const autoTenantEnable = ref(import.meta.env.VITE_AUTO_TENANT === 'true');
// 租户列表
const tenantList = ref<Tenant[]>([]);
// 当前选中的租户ID
const tenant = ref<string | null>(null);

// 获取租户列表
const getTenantList = async () => {
	try {
		const response = await fetchList();
		tenantList.value = response.data;
	} catch (error) {
		useMessage().error(t('tenantSelect.loadError'));
	}
};

// 自动匹配租户
const handleAutoTenant = () => {
	const domain = window.location.host;
	const matchedTenant = tenantList.value.find((tenant) => !validateNull(tenant.tenantDomain) && domain === tenant.tenantDomain);

	if (matchedTenant && Session.getTenant() !== matchedTenant.id) {
		handleCommand(matchedTenant);
	}
};

// 处理租户选择（原有方法，用于下拉菜单）
const handleCommand = (tenant: Tenant) => {
	Session.set(STORAGE_KEYS.TENANT_ID, tenant.id);
	Local.set(STORAGE_KEYS.TENANT_ID, tenant.id);
	Cookies.set(STORAGE_KEYS.TENANT_ID, tenant.id);
	window.location.reload();
};

// 处理租户变更（用于 el-select）
const handleTenantChange = (tenantId: string) => {
	const selectedTenant = tenantList.value.find(t => t.id === tenantId);
	if (selectedTenant) {
		handleCommand(selectedTenant);
	}
};

// 初始化租户配置
const initTenantConfig = () => {
	const stores = useThemeConfig(pinia);
	const { themeConfig } = storeToRefs(stores);
	const currentTenant = tenantList.value.find((item) => item.id === tenant.value);

	if (currentTenant) {
		// 设置全局标题
		themeConfig.value.globalTitle = currentTenant.websiteName || import.meta.env.VITE_GLOBAL_TITLE;
		// 设置页脚作者
		themeConfig.value.footerAuthor = currentTenant.footer || import.meta.env.VITE_FOOTER_TITLE;
		// 设置背景
		themeConfig.value.background = currentTenant.background || '';
		// 设置小程序二维码
		themeConfig.value.miniQr = currentTenant.miniQr || '';
	}

	Session.set('tenantId', tenant.value);
};

// 组件挂载时执行
onMounted(async () => {
	// 获取租户列表
	await getTenantList();
	// 获取当前租户ID
	tenant.value = Session.getTenant();

	// 如果启用了自动租户选择，则执行自动匹配
	if (autoTenantEnable.value) {
		handleAutoTenant();
	}

	// 初始化租户配置
	initTenantConfig();
});

// 获取当前租户名称
const getCurrentTenantName = computed(() => {
	const current = tenantList.value.find(item => item.id === tenant.value);
	return current?.name || t('tenantSelect.select');
});
</script>
