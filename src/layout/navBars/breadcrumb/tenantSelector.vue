<template>
	<el-dialog
		v-model="visible"
		:title="t('tenantSelector.title')"
		width="600px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
		class="tenant-selector-dialog"
	>
		<!-- 租户列表 -->
		<div class="tenant-list" v-loading="props.loading">
			<el-scrollbar height="400px">
				<div v-if="!props.loading && props.tenantList.length === 0" class="empty-state">
					<el-empty :description="t('tenantSelector.noData')" />
				</div>
				<div v-else-if="!props.loading" class="tenant-grid">
					<div
						v-for="item in props.tenantList"
						:key="item.id"
						class="tenant-card"
						:class="{ 
							active: item.id === currentTenantId && (!selectedTenant || selectedTenant.id === currentTenantId),
							selected: selectedTenant?.id === item.id && item.id !== currentTenantId
						}"
						@click="handleSelectTenant(item)"
					>
						<div class="tenant-card-header">
							<div class="tenant-icon">
								<el-icon :size="24">
									<ele-OfficeBuilding />
								</el-icon>
							</div>
							<!-- 当前生效的租户显示绿色勾 -->
							<div class="tenant-check" v-if="item.id === currentTenantId">
								<el-icon :size="16" color="#67c23a">
									<ele-CircleCheck />
								</el-icon>
							</div>
							<!-- 用户选择但未确认的租户显示蓝色勾 -->
							<div class="tenant-check" v-else-if="selectedTenant?.id === item.id">
								<el-icon :size="16" color="#409eff">
									<ele-CircleCheck />
								</el-icon>
							</div>
						</div>
						<div class="tenant-card-body">
							<h4 class="tenant-name">{{ item.name }}</h4>
							<p class="tenant-domain" v-if="item.tenantDomain">
								<el-icon :size="12"><ele-Link /></el-icon>
								{{ item.tenantDomain }}
							</p>
							<p class="tenant-website" v-if="item.websiteName">
								<el-icon :size="12"><ele-Document /></el-icon>
								{{ item.websiteName }}
							</p>
						</div>
						<div class="tenant-card-footer">
							<el-tag v-if="item.id === currentTenantId" type="success" size="small">
								{{ t('tenantSelector.current') }}
							</el-tag>
							<el-tag v-else-if="selectedTenant?.id === item.id" type="primary" size="small">
								{{ t('tenantSelector.selected') }}
							</el-tag>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleClose">{{ t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="handleConfirm" :loading="props.loading">
					{{ t('common.confirmButtonText') }}
				</el-button>
			</span>
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

<style scoped lang="scss">
.tenant-selector-dialog {
	:deep(.el-dialog__body) {
		padding-top: 10px !important;
	}
}

.tenant-list {
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 400px;
	}

	.tenant-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 16px;
		padding: 4px;
	}

	.tenant-card {
		position: relative;
		background: var(--el-bg-color);
		border: 2px solid var(--el-border-color-lighter);
		border-radius: 8px;
		padding: 20px;
		cursor: pointer;
		transition: all 0.3s ease;
		overflow: hidden;

		&:hover {
			border-color: var(--el-color-primary-light-3);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
			transform: translateY(-2px);
		}

		&.active {
			border-color: var(--el-color-success);
			background: var(--el-color-success-light-9);
			box-shadow: 0 2px 8px rgba(103, 194, 58, 0.2);
		}

		&.selected {
			border-color: var(--el-color-primary);
			background: var(--el-color-primary-light-9);
			box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
			transform: translateY(-2px);
		}

		.tenant-card-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 12px;

			.tenant-icon {
				width: 48px;
				height: 48px;
				background: var(--el-color-primary-light-8);
				border-radius: 12px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: var(--el-color-primary);
			}

			.tenant-check {
				position: absolute;
				top: 12px;
				right: 12px;
			}
		}

		.tenant-card-body {
			.tenant-name {
				font-size: 16px;
				font-weight: 600;
				color: var(--el-text-color-primary);
				margin: 0 0 8px 0;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.tenant-domain,
			.tenant-website {
				font-size: 13px;
				color: var(--el-text-color-regular);
				margin: 4px 0;
				display: flex;
				align-items: center;
				gap: 4px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;

				.el-icon {
					flex-shrink: 0;
				}
			}
		}

		.tenant-card-footer {
			margin-top: 12px;
			display: flex;
			align-items: center;
			justify-content: flex-start;
		}
	}
}

// 暗黑模式适配
html.dark {
	.tenant-card {
		&.active {
			background: rgba(103, 194, 58, 0.1);
		}

		&.selected {
			background: rgba(64, 158, 255, 0.1);
		}

		.tenant-card-header {
			.tenant-icon {
				background: rgba(64, 158, 255, 0.2);
			}
		}
	}
}
</style> 