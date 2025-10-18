<template>
	<el-dialog
		v-model="visible"
		:title="t('tenantSelector.title')"
		width="600px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<!-- 租户列表 -->
		<div v-loading="props.loading">
			<el-scrollbar height="400px">
				<div v-if="!props.loading && props.tenantList.length === 0" class="flex items-center justify-center h-[400px]">
					<el-empty :description="t('tenantSelector.noData')" />
				</div>
				<div v-else-if="!props.loading" class="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1">
					<div
						v-for="item in props.tenantList"
						:key="item.id"
						class="card bg-base-100 border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
						:class="{
							'border-success bg-success/5': item.id === currentTenantId && (!selectedTenant || selectedTenant.id === currentTenantId),
							'border-primary bg-primary/5 shadow-md': selectedTenant?.id === item.id && item.id !== currentTenantId,
							'border-base-300': selectedTenant?.id !== item.id && item.id !== currentTenantId
						}"
						@click="handleSelectTenant(item)"
					>
						<div class="card-body p-4 gap-3">
							<!-- Header -->
							<div class="flex items-center justify-between">
								<div class="avatar placeholder">
									<div class="bg-primary/10 text-primary rounded-lg w-12 h-12 flex items-center justify-center">
										<el-icon :size="24">
											<ele-OfficeBuilding />
										</el-icon>
									</div>
								</div>
								<!-- 当前租户勾 -->
								<el-icon v-if="item.id === currentTenantId" :size="16" color="#67c23a">
									<ele-CircleCheck />
								</el-icon>
								<!-- 选中租户勾 -->
								<el-icon v-else-if="selectedTenant?.id === item.id" :size="16" color="#409eff">
									<ele-CircleCheck />
								</el-icon>
							</div>

							<!-- Body -->
							<div class="space-y-1">
								<h4 class="font-semibold text-base truncate">{{ item.name }}</h4>
								<p v-if="item.tenantDomain" class="text-sm text-base-content/70 flex items-center gap-1 truncate">
									<el-icon :size="12"><ele-Link /></el-icon>
									<span class="truncate">{{ item.tenantDomain }}</span>
								</p>
								<p v-if="item.websiteName" class="text-sm text-base-content/70 flex items-center gap-1 truncate">
									<el-icon :size="12"><ele-Document /></el-icon>
									<span class="truncate">{{ item.websiteName }}</span>
								</p>
							</div>

							<!-- Footer -->
							<div class="flex">
								<el-tag v-if="item.id === currentTenantId" type="success" size="small">
									{{ t('tenantSelector.current') }}
								</el-tag>
								<el-tag v-else-if="selectedTenant?.id === item.id" type="primary" size="small">
									{{ t('tenantSelector.selected') }}
								</el-tag>
							</div>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div>

		<template #footer>
			<div class="flex gap-2 justify-end">
				<el-button @click="handleClose">{{ t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="handleConfirm" :loading="props.loading">
					{{ t('common.confirmButtonText') }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="TenantSelector">
import { useI18n } from 'vue-i18n';
import { switchPersonalTenant } from '/@/api/admin/tenant';
import { Local, Session } from '/@/utils/storage';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useUserInfo } from '/@/stores/userInfo';
import { storeToRefs } from 'pinia';
import { useMessage } from '/@/hooks/message';
import { PropType } from 'vue';

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

// 定义组件的 props 和 emits
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	tenantList: {
		type: Array as PropType<Tenant[]>,
		default: () => []
	},
	loading: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['update:modelValue', 'change']);

// 响应式数据
const visible = ref(false);
const currentTenantId = ref<string>('');
const selectedTenant = ref<Tenant | null>(null);
const userInfoStore = useUserInfo();
	
// 更新当前租户信息
const updateCurrentTenantInfo = () => {
	// 获取当前租户ID
	currentTenantId.value = Session.getTenant() || '';
	// 设置默认选中的租户
	const current = props.tenantList.find((item: Tenant) => item.id === currentTenantId.value);
	if (current) {
		userInfoStore.updateTenantInfo(current.id, current.name);
		selectedTenant.value = current;
	}
};

// 初始化租户数据
const initTenantData = () => {
	updateCurrentTenantInfo();
};

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
	visible.value = val;
	if (val) {
		initTenantData();
	}
});

// 监听 visible 变化，同步到父组件
watch(visible, (val) => {
	emit('update:modelValue', val);
});

// 监听 props.tenantList 变化，更新当前租户信息
watch(() => props.tenantList, (newList) => {
	if (newList && newList.length > 0) {
		updateCurrentTenantInfo();
	}
}, { immediate: true, deep: true });

// 选择租户
const handleSelectTenant = (tenant: Tenant) => {
	selectedTenant.value = tenant;
};

// 确认切换
const handleConfirm = () => {
	if (!selectedTenant.value) {
		useMessage().warning(t('tenantSelector.selectTip'));
		return;
	}

	if (selectedTenant.value.id === currentTenantId.value) {
		useMessage().info(t('tenantSelector.sameError'));
		return;
	}
  switchTenant(selectedTenant.value!);
};

// 切换租户
const switchTenant = async (tenant: Tenant) => {
	try {
		
		// 调用后台API进行租户切换
		await switchPersonalTenant(tenant.id);
		
		// 更新用户信息中的租户信息
		userInfoStore.updateTenantInfo(tenant.id, tenant.name);
		
		// 更新主题配置
		const stores = useThemeConfig();
		const { themeConfig } = storeToRefs(stores);
		
		// 设置全局标题
		themeConfig.value.globalTitle = tenant.websiteName || import.meta.env.VITE_GLOBAL_TITLE;
		// 设置页脚作者
		themeConfig.value.footerAuthor = tenant.footer || import.meta.env.VITE_FOOTER_TITLE;
		// 设置背景
		themeConfig.value.background = tenant.background || '';
		// 设置小程序二维码
		themeConfig.value.miniQr = tenant.miniQr || '';

		Local.remove('themeConfig');
		Local.set('themeConfig', themeConfig.value);

		// 触发变更事件
		emit('change', tenant);
		
		// 显示成功消息
		useMessage().success(t('tenantSelector.switchSuccess'));
		
		// 关闭弹窗
		visible.value = false;
		
		// 延迟后刷新页面
		window.location.reload();
	} catch (error: any) {
		useMessage().error(error.msg || t('tenantSelector.switchError'));
	}
};

// 关闭弹窗
const handleClose = () => {
	visible.value = false;
	selectedTenant.value = null;
};

// 暴露方法给父组件
defineExpose({
	open: () => {
		visible.value = true;
		initTenantData();
	},
	close: handleClose,
	// 添加获取租户数量的方法
	getTenantCount: () => props.tenantList.length,
	// 添加初始化方法供父组件调用
	init: () => {
		initTenantData();
	}
});
</script> 