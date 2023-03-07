<template>
	<div class="top-right-btn" :style="style">
		<el-row>
			<el-tooltip
				class="item"
				effect="dark"
				:content="showSearch ? $t('queryTree.hideSearch') : $t('queryTree.displayTheSearch')"
				placement="top"
				v-if="search"
			>
				<el-button circle icon="Search" @click="toggleSearch()" />
			</el-tooltip>
			<el-tooltip class="item" effect="dark" :content="$t('queryTree.refresh')" placement="top">
				<el-button circle icon="Refresh" @click="refresh()" />
			</el-tooltip>
		</el-row>
	</div>
</template>

<script setup name="right-toolbar">
const props = defineProps({
	showSearch: {
		type: Boolean,
		default: true,
	},
	search: {
		type: Boolean,
		default: true,
	},
	gutter: {
		type: Number,
		default: 10,
	},
});

const emits = defineEmits(['update:showSearch', 'queryTable']);

const style = computed(() => {
	const ret = {};
	if (props.gutter) {
		ret.marginRight = `${props.gutter / 2}px`;
	}
	return ret;
});

// 搜索
function toggleSearch() {
	emits('update:showSearch', !props.showSearch);
}

// 刷新
function refresh() {
	emits('queryTable');
}
</script>

<style lang="scss" scoped>
:deep(.el-transfer__button) {
	border-radius: 50%;
	display: block;
	margin-left: 0px;
}

:deep(.el-transfer__button:first-child) {
	margin-bottom: 10px;
}

.my-el-transfer {
	text-align: center;
}
</style>
