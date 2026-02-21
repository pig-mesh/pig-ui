<script setup lang="ts">
import { computed } from 'vue';
import { useFlowStore } from '/@/views/flow/workflow/stores/flow';
import { flattenFormItems } from '/@/views/flow/workflow/utils/formUtils';

const props = defineProps({
	formPerm: {
		type: Object,
		default: () => {},
	},
	hideKey: {
		type: Array,
		default: () => [],
	},
});

let flowStore = useFlowStore();

const step2FormList = computed(() => {
	const step2 = flowStore.step2;
	// 只展示有title的表单项(过滤掉没有title的项)
	const flattened = flattenFormItems(step2.formRule || []);
	return flattened.filter(item => item.field && item.title);
});
</script>

<template>
	<div class="w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
		<!-- 表头 -->
		<div class="grid grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
			<div class="text-sm font-semibold text-gray-900 dark:text-gray-100">
				表单字段
			</div>
			<div class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
				只读
			</div>
			<div class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
				编辑
			</div>
			<div class="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center">
				隐藏
			</div>
		</div>

		<!-- 空状态 -->
		<div v-if="step2FormList.length == 0" class="p-8">
			<el-empty description="暂无表单" />
		</div>

		<!-- 表单项列表 -->
		<div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
			<div 
				v-for="(item, index) in step2FormList" 
				:key="item.name"
				class="grid grid-cols-4 gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
				:class="{
					'bg-gray-50/50 dark:bg-gray-800/50': index % 2 === 0
				}"
			>
				<!-- 表单字段名称 -->
				<div class="flex items-center space-x-1">
					<span class="text-sm text-gray-900 dark:text-gray-100 font-medium">
						{{ item.title }}
					</span>
					<span 
						v-if="item.required" 
						class="text-red-500 dark:text-red-400 text-sm font-semibold"
					>
						*
					</span>
				</div>

				<!-- 权限选择器 -->
				<el-radio-group 
					v-model="formPerm[item.field]" 
					class="col-span-3 grid grid-cols-3 gap-4"
				>
					<!-- 只读 -->
					<div class="flex justify-center">
						<el-radio 
							label="R" 
							class="custom-radio text-blue-600 dark:text-blue-400"
						>
							<template #default>
								<span class="sr-only">只读</span>
							</template>
						</el-radio>
					</div>
					
					<!-- 编辑 -->
					<div class="flex justify-center">
						<el-radio 
							:disabled="!(hideKey.length == 0 || hideKey.indexOf('E') < 0)" 
							label="E"
							class="custom-radio text-green-600 dark:text-green-400"
						>
							<template #default>
								<span class="sr-only">编辑</span>
							</template>
						</el-radio>
					</div>
					
					<!-- 隐藏 -->
					<div class="flex justify-center">
						<el-radio 
							label="H"
							class="custom-radio text-gray-600 dark:text-gray-400"
						>
							<template #default>
								<span class="sr-only">隐藏</span>
							</template>
						</el-radio>
					</div>
				</el-radio-group>
			</div>
		</div>
	</div>
</template>

