<template>
	<div class="flex items-center justify-end pr-[15px]" :style="{ flex: layoutUserFlexNum }">
		<!-- 全局搜索 -->
		<div class="px-2 md:px-[6px] lg:px-2 cursor-pointer text-[var(--next-bg-topBarColor)] h-[50px] leading-[50px] flex items-center transition-colors duration-300 hover:bg-[var(--next-color-user-hover)]" @click="onSearchClick">
			<el-icon :title="$t('user.title2')" :size="18">
				<ele-Search />
			</el-icon>
		</div>
		<!-- 通知消息 -->
		<div class="px-2 md:px-[6px] lg:px-2 cursor-pointer text-[var(--next-bg-topBarColor)] h-[50px] leading-[50px] flex items-center transition-colors duration-300 hover:bg-[var(--next-color-user-hover)]">
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
		<!-- 展示部门信息/切换功能-->
		<div v-if="deptList.length > 0" class="px-2 md:px-[6px] lg:px-2 text-[var(--next-bg-topBarColor)] h-[50px] leading-[50px] flex items-center">
			<!-- 只有一个部门时，显示纯文本 -->
			<span v-if="deptList.length === 1" class="flex items-center whitespace-nowrap text-[var(--next-bg-topBarColor)] text-sm">
				{{ currentDeptName }}
			</span>
			<!-- 多个部门时，显示下拉选择 -->
			<el-dropdown v-else @command="onDeptChange" :show-timeout="70" :hide-timeout="50">
				<span class="flex items-center whitespace-nowrap cursor-pointer text-[var(--next-bg-topBarColor)] text-sm transition-opacity duration-300 hover:opacity-80">
					{{ currentDeptName }}
					<el-icon class="el-icon--right">
						<ele-ArrowDown />
					</el-icon>
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item
							v-for="dept in deptList"
							:key="dept.deptId"
							:command="dept.deptId"
							:disabled="dept.deptId === currentDeptId"
						>
							{{ dept.name }}
						</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>
		<!-- 用户菜单 - 添加分隔线 -->
		<div class="w-px h-[18px] bg-[var(--next-border-color-light)] mx-[2px] md:mx-[6px] lg:mx-[2px] opacity-60"></div>
		<div class="px-2 md:px-[6px] lg:px-2">
			<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
				<span class="h-full flex items-center whitespace-nowrap cursor-pointer transition-colors duration-300 hover:bg-[var(--next-color-user-hover)]">
					<img v-if="userInfos.user.avatar && !avatarError" :src="userInfos.user.avatar?.startsWith('http') ? userInfos.user.avatar : baseURL + userInfos.user.avatar" class="w-[25px] h-[25px] rounded-full mr-[5px]" @error="avatarError = true" />
					<NameAvatar v-else :name="userInfos.user.name || userInfos.user.username" :size="25" class="mr-[5px]" />
					<span class="text-sm md:text-sm">{{ userInfos.user.username }}</span>
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
					<el-dropdown-item divided command="logOut">{{ $t('user.dropdown5') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>
		</div>
		<Search ref="searchRef" />
		<global-websocket uri="/admin/ws/info" v-if="websocketEnable" @rollback="rollback" />
		<personal-drawer ref="personalDrawerRef"></personal-drawer>
		<tenant-selector
			ref="tenantSelectorRef"
			:tenant-list="tenantList"
			:loading="tenantLoading"
			@change="onTenantChange"
		></tenant-selector>
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
import { switchPersonalDept } from '/@/api/admin/dept';
import type { Dept } from '/@/api/admin/dept';

// 引入组件
const GlobalWebsocket = defineAsyncComponent(() => import('/@/components/Websocket/index.vue'));
const UserNews = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/userNews.vue'));
const Search = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/search.vue'));
const PersonalDrawer = defineAsyncComponent(() => import('/@/views/admin/system/user/personal.vue'));
const TenantSelector = defineAsyncComponent(() => import('./tenantSelector.vue'));
const NameAvatar = defineAsyncComponent(() => import('/@/components/NameAvatar/index.vue'));

interface Tenant {
	id: string;
	name: string;
	tenantDomain?: string;
	websiteName?: string;
	footer?: string;
	background?: string;
	miniQr?: string;
}

const { t } = useI18n();
const router = useRouter();
const stores = useUserInfo();
const { userInfos } = storeToRefs(stores);
const { themeConfig } = storeToRefs(useThemeConfig());
const searchRef = ref();
const newsRef = ref();
const personalDrawerRef = ref();
const tenantSelectorRef = ref();

const tenantList = ref<Tenant[]>([]);
const tenantLoading = ref(false);
const deptList = ref<Dept[]>([]);
const avatarError = ref(false);

const shouldShowTenantOption = computed(() => tenantList.value.length > 1);

const currentDeptId = computed(() => Session.getDeptId() || userInfos.value.deptId);

// 计算属性：当前部门显示名称
const currentDeptName = computed(() => {
	const currentDept = deptList.value.find((dept) => dept.deptId === currentDeptId.value);
	return currentDept?.name || t('user.selectDept');
});

const websocketEnable = ref(import.meta.env.VITE_WEBSOCKET_ENABLE === 'true');

// 设置分割样式
const layoutUserFlexNum = computed(() => {
	const { layout, isClassicSplitMenu } = themeConfig.value;
	return ['defaults', 'columns'].includes(layout) || (layout === 'classic' && !isClassicSplitMenu) ? '1' : '';
});

// 下拉菜单点击
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
	} else {
		router.push(path);
	}
};

const onSearchClick = () => {
	searchRef.value.openSearch();
};

const onDeptChange = async (deptId: string) => {
	try {
		// 调用切换接口
		await switchPersonalDept(deptId);
		// 更新 store
		stores.updateDeptInfo(deptId);
		// 刷新页面
		window.location.reload();
	} catch (error) {
		console.error('切换部门失败:', error);
	}
};

const rollback = (msg: string) => {
	useMsg().setMsg({ label: 'websocket消息', value: msg, time: formatAxisI18n(new Date(), t) });
};

const isDot = ref(false);
const getIsDot = () => {
	fetchUserMessageList({ category: '1', readFlag: '0' }).then((res) => {
		isDot.value = res.data.total !== 0;
	});
};

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

const onTenantChange = () => {
	loadTenantList();
};

const loadDeptList = () => {
	deptList.value = userInfos.value.deptList || [];
};

onMounted(() => {
	getIsDot();
	loadTenantList();
	loadDeptList();
});
</script>

<style scoped lang="scss">
// Element Plus 组件深层样式定制
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

// 图标 hover 动画
.hover\:bg-\[var\(--next-color-user-hover\)\]:hover i {
	display: inline-block;
	animation: logoAnimation 0.3s ease-in-out;
}
</style>
