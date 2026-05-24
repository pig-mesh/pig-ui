<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<!-- 主内容区：flex-1 撑满剩余高度，左右各自独立滚动 -->
			<div class="flex flex-1 min-h-0">
				<!-- 左侧：基础配置，可折叠 -->
				<div class="flex flex-col flex-shrink-0 min-h-0 transition-all duration-300"
					:class="collapsed ? 'w-10' : 'w-96'">
					<el-card shadow="hover" class="gen-card flex flex-col flex-1 min-h-0 !overflow-hidden">
						<template #header>
							<div class="flex items-center" :class="collapsed ? 'justify-center' : 'justify-between'">
								<div v-if="!collapsed" class="flex items-center flex-1 min-w-0 gap-2">
									<span
										class="flex-shrink-0 text-sm font-semibold text-gray-700 dark:text-gray-200">基础配置</span>
									<span class="text-xs text-gray-400 truncate dark:text-gray-500">{{ tableNameStr
									}}</span>
								</div>
								<el-tooltip :content="collapsed ? '展开配置' : '收起配置'" placement="right">
									<el-button :icon="collapsed ? 'DArrowRight' : 'DArrowLeft'" circle size="small"
										plain @click="collapsed = !collapsed" />
								</el-tooltip>
							</div>
						</template>
						<div v-show="!collapsed" class="h-full pr-1 overflow-y-auto">
							<Generator ref="generatorRef" :tableName="tableName" :dsName="dsName" />
						</div>
					</el-card>
				</div>

				<!-- 右侧：字段配置 -->
				<div class="flex flex-col flex-1 min-w-0 min-h-0">
					<el-card shadow="hover" class="gen-card flex flex-col flex-1 min-h-0 !overflow-hidden">
						<div class="h-full overflow-y-auto">
							<EditTable ref="editTableRef" :tableName="tableName" :dsName="dsName" />
						</div>
					</el-card>
				</div>
			</div>

			<!-- 吸底操作栏 -->
			<ActionFooter :loading="isLoading" @back="handleBack" @preview="handlePreview" @generate="handleGenerate" />

			<!-- 预览弹窗 -->
			<PreviewDialog ref="previewDialogRef" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core';
import { useI18n } from 'vue-i18n';
import { useGeneratorCodeApi } from '/@/api/gen/table';
import { useMessage } from '/@/hooks/message';
import mittBus from '/@/utils/mitt';
import { downBlobFile } from '/@/utils/other';
import Generator from '../table/generator.vue';
import EditTable from '../table/edit.vue';
import PreviewDialog from '../table/preview.vue';
import ActionFooter from './components/ActionFooter.vue';

const { t } = useI18n();
const message = useMessage();

const route = useRoute();
const tableName = computed(() => String(route.query.tableName ?? ''));
const dsName = computed(() => String(route.query.dsName ?? ''));

const collapsed = ref(false);
const tableNameStr = computed(() => tableName.value || dsName.value);
const previewDialogRef = ref();
const generatorRef = ref();
const editTableRef = ref();
const tableId = ref('');
const generatorType = ref('');

const { isLoading, execute: submitAll } = useAsyncState(
	async () => {
		const data = await generatorRef.value.submitHandle();
		tableId.value = data.id;
		generatorType.value = data.generatorType;
		await editTableRef.value.submitHandle();
	},
	undefined,
	{ immediate: false, throwError: true }
);

const executeWithSubmit = async (action: () => void) => {
	if (isLoading.value) return;
	try {
		await submitAll();
		action();
	} catch {
		// Error already handled by useAsyncState
	}
};

const handleBack = () => {
	mittBus.emit('onCurrentContextmenuClick', { contextMenuClickId: 1, ...route });
};

const handlePreview = () => executeWithSubmit(() => {
	previewDialogRef.value.openDialog(tableId.value);
});

const handleGenerate = () => executeWithSubmit(() => {
	if (generatorType.value === '0') {
		downBlobFile(`/gen/generator/download?tableIds=${tableId.value}`, {}, `${tableName.value}.zip`).catch((msg) => {
			message.error(msg);
		});
	}
	if (generatorType.value === '1') {
		useGeneratorCodeApi(tableId.value)
			.then(() => message.success(t('common.optSuccessText')))
			.catch(({ msg }) => message.error(msg));
	}
});
</script>

<style scoped>
/* el-card 自身参与 flex 伸缩，body 区域独立滚动 */
:deep(.gen-card.el-card) {
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

:deep(.gen-card .el-card__body) {
	flex: 1;
	min-height: 0;
	overflow: hidden;
	padding: 12px;
}
</style>
