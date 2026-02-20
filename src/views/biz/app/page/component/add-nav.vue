<template>
	<div class="w-full">
		<!-- 拖拽列表 -->
		<draggable
			class="space-y-3 mb-4"
			v-model="navLists"
			item-key="index"
			animation="300"
			handle=".drag-handle"
		>
			<template v-slot:item="{ element: item, index }">
				<del-wrap :key="index" @close="handleDelete(index)" class="w-full">
					<div
						class="group relative flex items-center w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800/50 dark:to-gray-800/30 transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5"
					>
						<!-- 拖拽手柄 -->
						<div class="drag-handle absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200">
							<el-icon class="text-gray-400 dark:text-gray-500 text-lg">
								<DCaret />
							</el-icon>
						</div>

						<!-- 图标上传区域 -->
						<div class="ml-6 flex-shrink-0">
							<div class="relative">
								<upload-img
									v-model:imageUrl="item.image"
									height="56px"
									width="56px"
									:iconSize="16"
									class="rounded-xl overflow-hidden shadow-sm ring-2 ring-gray-100 dark:ring-gray-700 transition-all duration-300 hover:ring-primary/50 hover:scale-105"
								/>
								<div v-if="!item.image" class="absolute inset-0 flex items-center justify-center pointer-events-none">
									<el-icon class="text-2xl text-gray-400 dark:text-gray-500"><Picture /></el-icon>
								</div>
							</div>
						</div>

						<!-- 表单区域 -->
						<div class="flex-1 ml-4 space-y-3 min-w-0">
							<div class="flex items-center gap-3">
								<label class="flex-shrink-0 w-12 text-sm font-medium text-gray-700 dark:text-gray-300">名称</label>
								<el-input
									v-model="item.name"
									placeholder="请输入服务名称"
									clearable
									class="flex-1 transition-all duration-200 !w-full"
								>
									<template #prefix>
										<el-icon class="text-gray-400"><Edit /></el-icon>
									</template>
								</el-input>
							</div>

							<div class="flex items-center gap-3">
								<label class="flex-shrink-0 w-12 text-sm font-medium text-gray-700 dark:text-gray-300">链接</label>
								<link-picker v-model="item.link" class="flex-1 !w-full" />
							</div>
						</div>

						<!-- 序号标识 -->
						<div class="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full shadow-md">
							{{ index + 1 }}
						</div>
					</div>
				</del-wrap>
			</template>
		</draggable>

		<!-- 空状态 -->
		<div
			v-if="navLists.length === 0"
			class="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800/30 transition-colors mb-4"
		>
			<el-icon class="text-5xl text-gray-300 dark:text-gray-600 mb-3"><Grid /></el-icon>
			<div class="text-gray-500 dark:text-gray-400 text-sm">暂无服务项，点击下方按钮添加</div>
		</div>

		<!-- 添加按钮 -->
		<div class="flex items-center gap-3">
			<el-button
				type="primary"
				@click="handleAdd"
				:disabled="navLists.length >= props.max"
				class="!px-6 !py-2 !rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
				:icon="Plus"
			>
				添加服务
			</el-button>
			<span class="text-sm text-gray-500 dark:text-gray-400">
				已添加 {{ navLists.length }} / {{ props.max }} 项
			</span>
		</div>
	</div>
</template>
<script lang="ts" setup>
import Draggable from 'vuedraggable';
import { useMessage } from '/@/hooks/message';
import { Plus } from '@element-plus/icons-vue';
const LinkPicker = defineAsyncComponent(() => import('/@/components/Link/picker.vue'));

const props = defineProps({
	modelValue: {
		type: Array as any,
		default: () => [],
	},
	max: {
		type: Number,
		default: 10,
	},
	min: {
		type: Number,
		default: 1,
	},
});

const emit = defineEmits(['update:modelValue']);
const navLists = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	},
});

const handleAdd = () => {
	if (props.modelValue?.length < props.max) {
		navLists.value.push({
			image: '',
			name: '导航名称',
			link: {},
		});
	} else {
		useMessage().error(`最多添加${props.max}个`);
	}
};
const handleDelete = (index: number) => {
	if (props.modelValue?.length <= props.min) {
		return useMessage().error(`最少保留${props.min}个`);
	}
	navLists.value.splice(index, 1);
};
</script>

