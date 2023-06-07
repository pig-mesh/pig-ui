<template>
	<el-tooltip class="box-item" effect="dark" :content="props.content" :placement="props.placement">
		<el-icon><QuestionFilled /></el-icon>
		<slot></slot>
	</el-tooltip>
</template>

<script setup lang="ts" name="tip">
const props = defineProps({
	content: {
		type: String,
	},
	placement: {
		type: String,
		default: 'top-start',
	},
});
</script>
