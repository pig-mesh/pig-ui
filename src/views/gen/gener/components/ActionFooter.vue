<template>
	<div
		class="sticky bottom-0 z-50 flex justify-center gap-4 px-6 py-3.5 mt-1
		       bg-white dark:bg-gray-900
		       border-t border-gray-200 dark:border-gray-700
		       shadow-[0_-2px_8px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_8px_rgba(0,0,0,0.3)]"
	>
		<el-button class="action-footer__button action-footer__button--back" size="large" icon="ArrowLeft" plain @click="emit('back')">返回</el-button>
		<el-button class="action-footer__button action-footer__button--preview" size="large" icon="View" type="info" plain :loading="loading" @click="emit('preview')">
			保存并预览
		</el-button>
		<el-button class="action-footer__button" size="large" icon="Download" type="primary" :loading="loading" @click="emit('generate')">
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

<style>
.dark .action-footer__button--back.el-button.is-plain {
	color: #cbd5e1 !important;
	background-color: #1f2937 !important;
	border-color: #4b5563 !important;
}

.dark .action-footer__button--back.el-button.is-plain:hover,
.dark .action-footer__button--back.el-button.is-plain:focus {
	color: #f8fafc !important;
	background-color: #334155 !important;
	border-color: #64748b !important;
}

.dark .action-footer__button--preview.el-button,
.dark .action-footer__button--preview.el-button.is-plain,
.dark .action-footer__button--preview.el-button.is-loading,
.dark .action-footer__button--preview.el-button.is-disabled,
.dark .action-footer__button--preview.el-button.is-disabled:hover,
.dark .action-footer__button--preview.el-button.is-disabled:focus {
	color: #bfdbfe !important;
	background-color: #1e293b !important;
	border-color: #60a5fa !important;
	box-shadow: 0 10px 22px rgba(15, 23, 42, 0.32);
}

.dark .action-footer__button--preview.el-button:hover,
.dark .action-footer__button--preview.el-button:focus {
	color: #ffffff !important;
	background-color: #334155 !important;
	border-color: #93c5fd !important;
}

.dark .action-footer__button--preview.el-button:active {
	color: #ffffff !important;
	background-color: #1d4ed8 !important;
	border-color: #bfdbfe !important;
}
</style>
