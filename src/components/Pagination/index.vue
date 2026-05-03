<template>
	<el-pagination
		@size-change="sizeChangeHandle"
		@current-change="currentChangeHandle"
		class="mt15"
		:pager-count="5"
		:page-sizes="props.pageSizes"
		:current-page="current"
		background
		:page-size="size"
		:layout="props.layout"
		:total="total"
	>
	</el-pagination>
</template>

<script setup lang="ts" name="pagination">
import { useToNumber } from '@vueuse/core';

const emit = defineEmits(['sizeChange', 'currentChange']);

const props = defineProps({
	current: {
		type: [Number, String],
		default: 1,
	},
	size: {
		type: [Number, String],
		default: 10,
	},
	total: {
		type: [Number, String],
		default: 0,
	},
	pageSizes: {
		type: Array as () => number[],
		default: () => {
			return [1, 10, 20, 50, 100, 200];
		},
	},
	layout: {
		type: String,
		default: 'total, sizes, prev, pager, next, jumper',
	},
});

const current = useToNumber(() => props.current, { method: 'parseFloat', nanToZero: true });
const size = useToNumber(() => props.size, { method: 'parseFloat', nanToZero: true });
const total = useToNumber(() => props.total, { method: 'parseFloat', nanToZero: true });

// 分页改变
const sizeChangeHandle = (val: number) => {
	emit('sizeChange', val);
};
// 分页改变
const currentChangeHandle = (val: number) => {
	emit('currentChange', val);
};
</script>
