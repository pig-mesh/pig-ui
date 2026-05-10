<template>
	<div class="w-full">
		<el-form label-width="80px" class="px-1 w-full">
			<el-form-item label="是否启用" class="mb-6">
				<el-radio-group v-model="content.enabled" class="!flex gap-2">
					<el-radio :value="1" class="!mr-0" border>
						<span class="flex items-center gap-1">
							<el-icon><Check /></el-icon>
							开启
						</span>
					</el-radio>
					<el-radio :value="0" class="!mr-0" border>
						<span class="flex items-center gap-1">
							<el-icon><Close /></el-icon>
							停用
						</span>
					</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="快捷设置" class="!mb-4">
				<div class="flex-1 w-full">
					<div class="flex items-start gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
						<el-icon class="text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0"><InfoFilled /></el-icon>
						<div class="text-sm text-blue-700 dark:text-blue-300">
							<div class="font-medium mb-1">快捷方式设置</div>
							<div>• 最多可添加 <span class="font-semibold">8</span> 个快捷方式</div>
							<div>• 建议图标尺寸：<span class="font-semibold">24px × 24px</span></div>
							<div>• 支持拖拽排序</div>
						</div>
					</div>
					<AddWorkbenchItem v-model="content.data" :max="8" :show-color="true" />
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>
<script lang="ts" setup>
import type options from './options';
import AddWorkbenchItem from '../../add-workbench-item.vue';
type OptionsType = ReturnType<typeof options>;
defineProps({
	content: {
		type: Object as PropType<OptionsType['content']>,
		default: () => ({}),
	},
	styles: {
		type: Object as PropType<OptionsType['styles']>,
		default: () => ({}),
	},
});
</script>
