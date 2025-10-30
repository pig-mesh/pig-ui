<template>
	<el-dialog
		v-model="visible"
		:title="t('deptSelector.title')"
		width="600px"
		:close-on-click-modal="false"
		:close-on-press-escape="false"
		@close="handleClose"
	>
		<!-- 部门列表 -->
		<div v-loading="props.loading">
			<el-scrollbar height="400px">
				<div v-if="!props.loading && props.deptList.length === 0" class="flex items-center justify-center h-[400px]">
					<el-empty :description="t('deptSelector.noData')" />
				</div>
				<div v-else-if="!props.loading" class="grid grid-cols-1 gap-3 p-1 sm:grid-cols-2">
					<div
						v-for="item in props.deptList"
						:key="item.deptId"
						class="card bg-base-100 border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
						:class="{
							'border-success bg-success/5': item.deptId === currentDeptId && (!selectedDept || selectedDept.deptId === currentDeptId),
							'border-primary bg-primary/5 shadow-md': selectedDept?.deptId === item.deptId && item.deptId !== currentDeptId,
							'border-base-300': selectedDept?.deptId !== item.deptId && item.deptId !== currentDeptId
						}"
						@click="handleSelectDept(item)"
					>
						<div class="gap-3 p-4 card-body">
							<!-- Header -->
							<div class="flex items-center justify-between">
								<div class="avatar placeholder">
									<div class="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
										<el-icon :size="24">
											<ele-OfficeBuilding />
										</el-icon>
									</div>
								</div>
								<!-- 当前部门勾 -->
								<el-icon v-if="item.deptId === currentDeptId" :size="16" color="#67c23a">
									<ele-CircleCheck />
								</el-icon>
								<!-- 选中部门勾 -->
								<el-icon v-else-if="selectedDept?.deptId === item.deptId" :size="16" color="#409eff">
									<ele-CircleCheck />
								</el-icon>
							</div>

							<!-- Body -->
							<div class="space-y-1">
								<h4 class="text-base font-semibold truncate">{{ item.name }}</h4>
								<p v-if="item.parentName" class="flex items-center gap-1 text-sm truncate text-base-content/70">
									<el-icon :size="12"><ele-Position /></el-icon>
									<span class="truncate">{{ item.parentName }}</span>
								</p>
							</div>

							<!-- Footer -->
							<div class="flex">
								<el-tag v-if="item.deptId === currentDeptId" type="success" size="small">
									{{ t('deptSelector.current') }}
								</el-tag>
								<el-tag v-else-if="selectedDept?.deptId === item.deptId" type="primary" size="small">
									{{ t('deptSelector.selected') }}
								</el-tag>
							</div>
						</div>
					</div>
				</div>
			</el-scrollbar>
		</div>

		<template #footer>
			<div class="flex justify-end gap-2">
				<el-button @click="handleClose">{{ t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="handleConfirm" :loading="props.loading">
					{{ t('common.confirmButtonText') }}
				</el-button>
			</div>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="DeptSelector">
import { useI18n } from 'vue-i18n';
import { switchPersonalDept, type Dept } from '/@/api/admin/dept';
import { Session } from '/@/utils/storage';
import { useUserInfo } from '/@/stores/userInfo';
import { useMessage } from '/@/hooks/message';
import { PropType } from 'vue';

const { t } = useI18n();

// 定义组件的 props 和 emits
const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	deptList: {
		type: Array as PropType<Dept[]>,
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
const currentDeptId = ref<string>('');
const selectedDept = ref<Dept | null>(null);
const userInfoStore = useUserInfo();

// 更新当前部门信息
const updateCurrentDeptInfo = () => {
	// 获取当前部门ID
	currentDeptId.value = Session.getDeptId() || '';
	// 设置默认选中的部门
	const current = props.deptList.find((item: Dept) => item.deptId === currentDeptId.value);
	if (current) {
		userInfoStore.updateDeptInfo(current.deptId);
		selectedDept.value = current;
	}
};

// 初始化部门数据
const initDeptData = () => {
	updateCurrentDeptInfo();
};

// 监听 modelValue 变化
watch(() => props.modelValue, (val) => {
	visible.value = val;
	if (val) {
		initDeptData();
	}
});

// 监听 visible 变化，同步到父组件
watch(visible, (val) => {
	emit('update:modelValue', val);
});

// 监听 props.deptList 变化，更新当前部门信息
watch(() => props.deptList, (newList) => {
	if (newList && newList.length > 0) {
		updateCurrentDeptInfo();
	}
}, { immediate: true, deep: true });

// 选择部门
const handleSelectDept = (dept: Dept) => {
	selectedDept.value = dept;
};

// 确认切换
const handleConfirm = () => {
	if (!selectedDept.value) {
		useMessage().warning(t('deptSelector.selectTip'));
		return;
	}

	if (selectedDept.value.deptId === currentDeptId.value) {
		useMessage().info(t('deptSelector.sameError'));
		return;
	}
  switchDept(selectedDept.value!);
};

// 切换部门
const switchDept = async (dept: Dept) => {
	try {
		// 调用后台API进行部门切换
		await switchPersonalDept(dept.deptId);

		// 更新用户信息中的部门信息
		userInfoStore.updateDeptInfo(dept.deptId);

		// 触发变更事件
		emit('change', dept);

		// 显示成功消息
		useMessage().success(t('deptSelector.switchSuccess'));

		// 关闭弹窗
		visible.value = false;

		// 延迟后刷新页面（因为切换部门会影响权限）
		window.location.reload();
	} catch (error: any) {
		useMessage().error(error.msg || t('deptSelector.switchError'));
	}
};

// 关闭弹窗
const handleClose = () => {
	visible.value = false;
	selectedDept.value = null;
};

// 暴露方法给父组件
defineExpose({
	open: () => {
		visible.value = true;
		initDeptData();
	},
	close: handleClose,
	// 添加获取部门数量的方法
	getDeptCount: () => props.deptList.length,
	// 添加初始化方法供父组件调用
	init: () => {
		initDeptData();
	}
});
</script>
