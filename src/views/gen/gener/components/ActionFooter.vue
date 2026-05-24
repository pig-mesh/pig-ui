<template>
	<div
		class="sticky bottom-0 z-50 flex justify-center gap-4 px-6 py-3.5 mt-1
		       bg-white dark:bg-gray-900
		       border-t border-gray-200 dark:border-gray-700
		       shadow-[0_-2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.3)]"
	>
		<el-button size="large" icon="ArrowLeft" plain @click="emit('back')">返回</el-button>
		<el-button size="large" icon="View" type="info" plain :loading="loading" @click="emit('preview')">
			保存并预览
		</el-button>
		<el-button size="large" icon="Download" type="primary" :loading="loading" @click="emit('generate')">
			保存并生成
		</el-button>
	</div>
</template>

<script lang="ts" setup>
defineProps<{ loading?: boolean }>()
const emit = defineEmits<{
	back: []
	preview: []
	generate: []
}>()
</script>
