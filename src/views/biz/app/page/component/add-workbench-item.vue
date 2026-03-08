<template>
	<div>
		<div>
			<draggable class="draggable" v-model="workbenchLists" item-key="index" animation="300">
				<template v-slot:item="{ element: item, index }">
					<del-wrap class="max-w-[400px]" :key="index" @close="handleDelete(index)">
						<div class="flex items-start w-full p-4 mb-4 cursor-move bg-fill-light">
							<upload-img v-model:imageUrl="item.icon" height="50px" width="50px" :iconSize="12" />

							<div class="flex-1 ml-3">
								<div class="flex">
									<span class="flex-none mr-3 text-tx-regular w-12">名称</span>
									<el-input v-model="item.name" placeholder="请输入名称" />
								</div>
								<div class="flex mt-[18px]">
									<span class="flex-none mr-3 text-tx-regular w-12">链接</span>
									<link-picker v-model="item.link" />
								</div>
								<div v-if="showColor" class="flex mt-[18px]">
									<span class="flex-none mr-3 text-tx-regular w-12">颜色</span>
									<el-color-picker v-model="item.color" />
								</div>
								<div v-if="showBadge" class="flex mt-[18px]">
									<span class="flex-none mr-3 text-tx-regular w-12">徽章</span>
									<el-input v-model="item.badge" placeholder="可选，显示数字徽章" />
								</div>
							</div>
						</div>
					</del-wrap>
				</template>
			</draggable>
		</div>
		<div>
			<el-button type="primary" @click="handleAdd">添加</el-button>
		</div>
	</div>
</template>
<script lang="ts" setup>
import Draggable from 'vuedraggable';
import { useMessage } from '/@/hooks/message';
import other from '/@/utils/other';
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
			icon: '',
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

