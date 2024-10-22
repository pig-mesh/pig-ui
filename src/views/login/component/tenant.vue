<template>
	<div id="tenant" v-if="!autoTenantEnable">
		<el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
			<el-button circle>
				<SvgIcon name="local-tenant" />
			</el-button>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item v-for="item in tenantList" :key="item.id" :command="item">
						{{ item.name }}
						<el-icon class="ml8" v-if="selectBgFlag(item.id)">
							<Check />
						</el-icon>
					</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
	</div>
</template>

<script setup lang="ts" name="tenant">
import 'driver.js/dist/driver.min.css';
import Driver from 'driver.js';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import Cookies from 'js-cookie';
import { fetchList } from '/@/api/admin/tenant';
import { Local, Session } from '/@/utils/storage';
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
		useMessage().error('获取租户列表失败');
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

// 处理租户选择
const handleCommand = (tenant: Tenant) => {
	Session.set('tenantId', tenant.id);
	Local.set('tenantId', tenant.id);
	Cookies.set('tenantId', tenant.id);
	window.location.reload();
};

// 新用户引导
const guide = () => {
	const steps = [
		{
			element: '#tenant',
			popover: {
				title: t('tenant_guide.title'),
				description: t('tenant_guide.description'),
				position: 'left',
			},
		},
	];

	const driver = new Driver({
		allowClose: false,
		doneBtnText: '结束',
		closeBtnText: '关闭',
		nextBtnText: '下一步',
		prevBtnText: '上一步',
	});
	driver.defineSteps(steps);
	if (!Local.get('tenant-guide')) {
		driver.start();
		Local.set('tenant-guide', true);
	}
};

// 选中租户的高亮显示
const selectBgFlag = (id: string) => (id === Session.getTenant() ? 'Check' : '');

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
		themeConfig.value.background = currentTenant.background;
		// 设置小程序二维码
		themeConfig.value.miniQr = currentTenant.miniQr;
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
	} else {
	  // 如果没开启自动匹配，在下一个tick执行新用户引导
	  nextTick(guide);
	}

	// 初始化租户配置
	initTenantConfig();
});
</script>
