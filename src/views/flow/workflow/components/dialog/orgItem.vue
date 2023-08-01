<template>
	<div>
		<el-tag
			v-for="(item, index) in data"
			style="margin-right: 5px; margin-top: 5px"
			:key="item.id"
			:closable="!disabled"
			@close="removeItem(index, item.id, item.type)"
			:type="item.type === 'dept' ? '' : item.type === 'user' ? 'warning' : 'success'"
			size="large"
		>
			{{ item.name }}
		</el-tag>
	</div>
</template>

<script setup>
let emits = defineEmits(['update:data']);

let props = defineProps({
	data: {
		type: Array,
		default: () => [],
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const removeItem = (index, id, type) => {
	emits(
		'update:data',
		props.data.filter((res) => !(res.id === id && res.type === type))
	);
};
</script>
<style></style>
