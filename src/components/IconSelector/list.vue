<template>
	<div class="h-[230px] overflow-hidden">
		<el-scrollbar ref="selectorScrollbarRef">
			<el-row :gutter="10" class="p-[15px]" v-if="props.list.length > 0">
				<el-col :xs="6" :sm="4" :md="4" :lg="4" :xl="4" v-for="(v, k) in list" :key="k" @click="onColClick(v)">
					<div
						class="icon-selector-warp-item flex justify-center items-center border border-br rounded-[5px] mb-2.5 h-[30px] cursor-pointer hover:bg-primary-light-9 hover:border-primary-light-5 transition-colors"
						:class="{ 'icon-selector-active bg-primary-light-9 border-primary-light-5': prefix === v }"
					>
						<SvgIcon :name="v" />
					</div>
				</el-col>
			</el-row>
			<el-empty :image-size="100" v-if="list.length <= 0" :description="empty"></el-empty>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts" name="iconSelectorList">
// 定义父组件传过来的值
const props = defineProps({
	// 图标列表数据
	list: {
		type: Array,
		default: () => [],
	},
	// 自定义空状态描述文字
	empty: {
		type: String,
		default: () => '无相关图标',
	},
	// 高亮当前选中图标
	prefix: {
		type: String,
		default: () => '',
	},
});

// 定义子组件向父组件传值/事件
const emit = defineEmits(['get-icon']);

// 当前 icon 图标点击时
const onColClick = (v: string) => {
	emit('get-icon', v);
};
</script>

<style scoped>
/* Hide horizontal scrollbar */
:deep(.el-scrollbar__bar.is-horizontal) {
	display: none;
}

/* Icon color styling */
.icon-selector-warp-item :deep(i) {
	@apply text-xl text-[var(--el-text-color-regular)];
}

.icon-selector-warp-item:hover :deep(i),
.icon-selector-active :deep(i) {
	@apply text-primary;
}
</style>
