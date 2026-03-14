<!--
  OrgItem 已选标签展示组件

  功能：以 el-tag 标签形式展示已选中的组织项，不同类型用不同颜色区分。
  标签可关闭（非禁用状态下），关闭后从列表中移除。

  颜色规则：部门=primary（蓝），用户=warning（橙），其他=success（绿）
-->
<template>
	<div>
		<el-tag
			v-for="(item, index) in data"
			style="margin-right: 5px; margin-top: 5px"
			:key="item.id"
			:closable="!disabled"
			@close="removeItem(index, item.id, item.type)"
			:type="tagTypeMap[item.type] || 'success'"
			size="large"
		>
			{{ item.name }}
		</el-tag>
	</div>
</template>

<script setup>
const emits = defineEmits(['update:data']);

const props = defineProps({
	/** 已选中的组织项列表 */
	data: {
		type: Array,
		default: () => [],
	},
	/** 是否禁用（禁用时标签不可关闭） */
	disabled: {
		type: Boolean,
		default: false,
	},
});

/** 类型到 el-tag 颜色的映射 */
const tagTypeMap = {
	dept: 'primary',
	user: 'warning',
};

/** 移除指定项并通知父组件更新 */
const removeItem = (index, id, type) => {
	emits(
		'update:data',
		props.data.filter((res) => !(res.id === id && res.type === type))
	);
};
</script>
