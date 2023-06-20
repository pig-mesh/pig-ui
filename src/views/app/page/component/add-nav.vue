<template>
	<div>
		<div>
			<draggable class="draggable" v-model="navLists" item-key="index" animation="300">
				<template v-slot:item="{ element: item, index }">
					<del-wrap class="max-w-[400px]" :key="index" @close="handleDelete(index)">
						<div class="flex items-center w-full p-4 mb-4 cursor-move bg-fill-light">
							<upload-img v-model:imageUrl="item.image" height="50px" width="50px" iconSize="12" />

							<div class="flex-1 ml-3">
								<div class="flex">
									<span class="flex-none mr-3 text-tx-regular">名称</span>
									<el-input v-model="item.name" placeholder="请输入名称" />
								</div>
								<div class="flex mt-[18px]">
									<span class="flex-none mr-3 text-tx-regular">链接</span>
									<link-picker v-model="item.link" />
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
import type { PropType } from 'vue';
import Draggable from 'vuedraggable';
import { useMessage } from '/@/hooks/message';
const LinkPicker = defineAsyncComponent(() => import('/@/components/Link/picker.vue'));

const props = defineProps({
	modelValue: {
		type: Array as PropType<any[]>,
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

<style lang="scss" scoped></style>
