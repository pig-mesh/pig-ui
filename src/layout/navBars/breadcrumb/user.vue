<template>
	<div class="layout-navbars-breadcrumb-user pr15" :style="{ flex: layoutUserFlexNum }">
		<!-- 全局搜索 -->
		<div class="layout-navbars-breadcrumb-user-icon" @click="onSearchClick">
			<el-icon :title="$t('user.title2')" :size="18">
				<ele-Search />
			</el-icon>
		</div>
		<!-- 通知消息 -->
		<div class="layout-navbars-breadcrumb-user-icon">
			<el-popover placement="bottom" trigger="click" transition="el-zoom-in-top" :width="300" :persistent="false">
				<template #reference>
					<el-badge :is-dot="isDot">
						<el-icon :title="$t('user.title4')" :size="18">
							<ele-Bell />
						</el-icon>
					</el-badge>
				</template>
				<template #default>
					<UserNews ref="newsRef" />
				</template>
			</el-popover>
		</div>
		<!-- 用户菜单 - 添加分隔线 -->
		<div class="user-divider"></div>
		<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<img :src="userInfos.user.avatar?.startsWith('http') ? userInfos.user.avatar : baseURL + userInfos.user.avatar" class="layout-navbars-breadcrumb-user-link-photo mr5" />
				{{ userInfos.user.username }}
				<el-icon class="el-icon--right">
					<ele-ArrowDown />
				</el-icon>
			</span>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="/home">{{ $t('user.dropdown1') }}</el-dropdown-item>
          <el-dropdown-item command="personal">{{ $t('user.dropdown2') }}</el-dropdown-item>
          <el-dropdown-item v-if="shouldShowTenantOption" command="tenant">
						{{ $t('user.dropdown3') }}
					</el-dropdown-item>
					<el-dropdown-item v-if="shouldShowDeptOption" command="dept">
						{{ $t('user.dropdown4') }}
					</el-dropdown-item>
					<el-dropdown-item divided command="logOut">{{ $t('user.dropdown5') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		<Search ref="searchRef" />
		<global-websocket uri="/admin/ws/info" v-if="websocketEnable" @rollback="rollback" />
		<personal-drawer ref="personalDrawerRef"></personal-drawer>
		<tenant-selector
			ref="tenantSelectorRef"
			:tenant-list="tenantList"
			:loading="tenantLoading"
			@change="onTenantChange"
		></tenant-selector>
		<dept-selector
			ref="deptSelectorRef"
			:dept-list="deptList"
			:loading="deptLoading"
		></dept-selector>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUser">
import { logout } from '/@/api/login';
import { ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/userInfo';
import { useThemeConfig } from '/@/stores/themeConfig';
import mittBus from '/@/utils/mitt';
import { Session } from '/@/utils/storage';
import { formatAxisI18n } from '/@/utils/formatTime';
import { useMsg } from '/@/stores/msg';
import { fetchUserMessageList } from '/@/api/admin/message';
import { getPersonalTenant } from '/@/api/admin/tenant';

// 引入组件
const GlobalWebsocket = defineAsyncComponent(() => import('/@/components/Websocket/index.vue'));
const UserNews = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/userNews.vue'));
const Search = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/search.vue'));
const PersonalDrawer = defineAsyncComponent(() => import('/@/views/admin/system/user/personal.vue'));
const TenantSelector = defineAsyncComponent(() => import('./tenantSelector.vue'));
const DeptSelector = defineAsyncComponent(() => import('./deptSelector.vue'));

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

// 定义变量内容
const { t } = useI18n();
const router = useRouter();
const stores = useUserInfo();
const storesThemeConfig = useThemeConfig();
const { userInfos } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const searchRef = ref();
const newsRef = ref();
const personalDrawerRef = ref();
const tenantSelectorRef = ref();
const deptSelectorRef = ref();

// 租户列表状态
const tenantList = ref<Tenant[]>([]);
const tenantLoading = ref(false);

// 部门列表状态
const deptList = ref<Dept[]>([]);
const deptLoading = ref(false);

// 计算属性：是否应该显示租户选项
const shouldShowTenantOption = computed(() => {
	return tenantList.value.length > 1;
});

// 计算属性：是否应该显示部门选项
const shouldShowDeptOption = computed(() => {
	return deptList.value.length > 1;
});

// 计算属性：当前租户显示名称
const currentTenantName = computed(() => {
	if (tenantList.value.length <= 1) return null;
	const currentTenantId = Session.getTenant();
	const currentTenant = tenantList.value.find(tenant => tenant.id === currentTenantId);
	return currentTenant?.name || null;
});

interface State {
	[key: string]: boolean | string;
	isScreenfull: boolean;
	disabledI18n: string;
	disabledSize: string;
}

const state = reactive<State>({
	isScreenfull: false,
	disabledI18n: 'zh-cn',
	disabledSize: 'large',
});

// 是否开启websocket
const websocketEnable = ref(import.meta.env.VITE_WEBSOCKET_ENABLE === 'true');

// 设置分割样式
const layoutUserFlexNum = computed(() => {
	let num: string | number = '';
	const { layout, isClassicSplitMenu } = themeConfig.value;
	const layoutArr: string[] = ['defaults', 'columns'];
	if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
	else num = '';
	return num;
});

// 下拉菜单点击时
const onHandleCommandClick = (path: string) => {
	if (path === 'logOut') {
		ElMessageBox({
			closeOnClickModal: false,
			closeOnPressEscape: false,
			title: t('user.logOutTitle'),
			message: t('user.logOutMessage'),
			showCancelButton: true,
			confirmButtonText: t('user.logOutConfirm'),
			cancelButtonText: t('user.logOutCancel'),
			buttonSize: 'default',
			beforeClose: (action, instance, done) => {
				if (action === 'confirm') {
					instance.confirmButtonLoading = true;
					instance.confirmButtonText = t('user.logOutExit');
					setTimeout(() => {
						done();
						setTimeout(() => {
							instance.confirmButtonLoading = false;
						}, 300);
					}, 700);
				} else {
					done();
				}
			},
		})
			.then(async () => {
				// 关闭全部的标签页
				mittBus.emit('onCurrentContextmenuClick', Object.assign({}, { contextMenuClickId: 3, ...router }));
				// 调用后台接口
				await logout();
				// 清除缓存/token等
				Session.clear();
				// 使用 reload 时，不需要调用 resetRoute() 重置路由
				window.location.reload();
			})
			.catch(() => {});
	} else if (path === 'personal') {
		// 打开个人页面
		personalDrawerRef.value.open();
	} else if (path === 'tenant') {
		// 只有在租户数量大于1时才打开租户选择器
		if (shouldShowTenantOption.value) {
			tenantSelectorRef.value.open();
		}
	} else if (path === 'dept') {
		// 只有在部门数量大于1时才打开部门选择器
		if (shouldShowDeptOption.value) {
			deptSelectorRef.value.open();
		}
	} else {
		router.push(path);
	}
};

// 菜单搜索点击
const onSearchClick = () => {
	searchRef.value.openSearch();
};

// 获取到消息
const rollback = (msg: string) => {
	useMsg().setMsg({ label: 'websocket消息', value: msg, time: formatAxisI18n(new Date(), t) });
};

// 获取是否显示未读
const isDot = ref(false);
const getIsDot = () => {
	fetchUserMessageList({ category: '1', readFlag: '0' }).then((res) => {
		isDot.value = res.data.total !== 0;
	});
};

// 获取租户列表
const loadTenantList = async () => {
	try {
		tenantLoading.value = true;
		const response = await getPersonalTenant();
		tenantList.value = response.data || [];
	} catch (error) {
		console.error('加载租户列表失败:', error);
		tenantList.value = [];
	} finally {
		tenantLoading.value = false;
	}
};

// 处理租户切换后的回调
const onTenantChange = (tenant: Tenant) => {
	// 重新加载租户列表以确保数据同步
	loadTenantList();
};

// 获取部门列表
const loadDeptList = async () => {
	try {
		deptLoading.value = true;
		// 直接从 userInfoStore 中读取 deptList
		deptList.value = userInfos.value.deptList || [];
	} catch (error) {
		console.error('加载部门列表失败:', error);
		deptList.value = [];
	} finally {
		deptLoading.value = false;
	}
};

// 页面加载时
onMounted(() => {
	getIsDot();
	
	// 加载租户列表
	loadTenantList();

	// 加载部门列表
	loadDeptList();
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
	display: flex;
	align-items: center;
	justify-content: flex-end;

	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		padding: 0 8px;
		cursor: pointer;
		transition: background 0.3s ease-in-out;

		&:hover {
			background: var(--next-color-user-hover);
		}

		&-photo {
			width: 25px;
			height: 25px;
			border-radius: 100%;
		}
	}

	&-icon {
		padding: 0 8px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		transition: background 0.3s ease-in-out;

		&:hover {
			background: var(--next-color-user-hover);

			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}

	.user-divider {
		width: 1px;
		height: 18px;
		background: var(--next-border-color-light);
		margin: 0 8px;
		opacity: 0.6;
	}

	:deep(.el-dropdown) {
		color: var(--next-bg-topBarColor);
	}

	:deep(.el-badge) {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}

	:deep(.el-badge__content.is-fixed) {
		top: 12px;
	}
}

// 响应式适配
@media (max-width: 1200px) {
	.layout-navbars-breadcrumb-user {
		// 小屏幕时减少间距
		&-icon {
			padding: 0 6px;
		}

		.user-divider {
			margin: 0 6px;
		}

		&-link {
			padding: 0 6px;
		}
	}
}

@media (max-width: 768px) {
	.layout-navbars-breadcrumb-user {
		// 移动端进一步压缩
		&-icon {
			padding: 0 4px;
		}

		.user-divider {
			margin: 0 4px;
		}

		&-link {
			padding: 0 4px;
			font-size: 14px;
		}
	}
}
</style>
