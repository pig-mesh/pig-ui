<template>
	<div>
		<draggable class="space-y-3" v-model="workbenchLists" item-key="index" animation="300">
			<template v-slot:item="{ element: item, index }">
				<del-wrap class="w-full" :key="index" @close="handleDelete(index)">
					<div
						class="group relative flex items-start w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 cursor-move transition-all duration-300 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/5"
					>
						<!-- 拖拽手柄 -->
						<div class="absolute left-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
							<el-icon class="text-gray-400 dark:text-gray-500 text-lg"><DCaret /></el-icon>
						</div>

						<!-- 图标选择 -->
						<div class="ml-6 flex-none w-[160px]">
							<WotIconPicker v-model="item.icon" compact />
						</div>

						<!-- 表单字段 -->
						<div class="flex-1 ml-3 space-y-2.5 min-w-0">
							<div class="min-w-0">
								<div class="mb-1.5 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
									<el-icon class="mr-1"><Edit /></el-icon>名称
								</div>
								<el-input v-model="item.name" placeholder="请输入名称" clearable class="!w-full" />
							</div>

							<div class="min-w-0">
								<div class="mb-1.5 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
									<el-icon class="mr-1"><Link /></el-icon>链接
								</div>
								<link-picker v-model="item.link" class="!w-full" />
							</div>

							<div v-if="showColor" class="min-w-0">
								<div class="mb-1.5 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
									<el-icon class="mr-1"><Brush /></el-icon>颜色
								</div>
								<el-color-picker v-model="item.color" />
							</div>

							<div v-if="showBadge" class="min-w-0">
								<div class="mb-1.5 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
									<el-icon class="mr-1"><Bell /></el-icon>徽章
								</div>
								<el-input v-model="item.badge" placeholder="可选，显示数字徽章" clearable class="!w-full" />
							</div>
						</div>
					</div>
				</del-wrap>
			</template>
		</draggable>

		<div class="mt-3 flex items-center">
			<el-button
				v-if="modelValue?.length < max"
				type="primary"
				@click="handleAdd"
				class="!px-6 !py-2 !rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
				:icon="Plus"
			>
				添加快捷方式
			</el-button>
			<el-alert v-else type="warning" :closable="false" class="!rounded-lg">
				<template #title>
					<span class="text-sm">已达到上限（{{ max }} 个）</span>
				</template>
			</el-alert>
			<span v-if="modelValue?.length < max" class="ml-3 text-sm text-gray-500 dark:text-gray-400">
				已添加 <span class="font-semibold text-primary">{{ modelValue?.length || 0 }}</span> / {{ max }} 个
			</span>
		</div>
	</div>
</template>
<script lang="ts" setup>
import Draggable from 'vuedraggable';
import { useMessage } from '/@/hooks/message';
import { Plus } from '@element-plus/icons-vue';
import other from '/@/utils/other';
import WotIconPicker from './WotIconPicker.vue';
const LinkPicker = defineAsyncComponent(() => import('/@/components/Link/picker.vue'));

const props = defineProps({
	modelValue: {
		type: Array as any,
		default: () => [],
	},
	max: {
		type: Number,
		default: 8,
	},
	min: {
		type: Number,
		default: 1,
	},
	showColor: {
		type: Boolean,
		default: false,
	},
	showBadge: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue']);

const workbenchLists = computed({
	get() {
		return props.modelValue;
	},
	set(value) {
		emit('update:modelValue', value);
	},
});

const handleAdd = () => {
	if (props.modelValue?.length < props.max) {
		const newItem: any = {
			id: other.getNonDuplicateID(),
			icon: 'apps',
			name: '功能名称',
			link: {},
		};

		if (props.showColor) {
			newItem.color = '#007aff';
		}

		if (props.showBadge) {
			newItem.badge = '';
		}

		workbenchLists.value.push(newItem);
	} else {
		useMessage().error(`最多添加${props.max}个`);
	}
};

const handleDelete = (index: number) => {
	if (props.modelValue?.length <= props.min) {
		return useMessage().error(`最少保留${props.min}个`);
	}
	workbenchLists.value.splice(index, 1);
};
</script>
