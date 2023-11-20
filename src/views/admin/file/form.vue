<template>
	<el-dialog :title="$t('file.uploadFile')" v-model="visible" :close-on-click-modal="false" draggable>
		<upload @change="success" :model-value="fileList" />
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SysFileDialog">
const Upload = defineAsyncComponent(() => import('/@/components/Upload/index.vue'));
const emit = defineEmits(['refresh']);

// 定义变量内容
const visible = ref(false);
const fileList = ref([]);

// 打开弹窗
const openDialog = () => {
	fileList.value = [];
	visible.value = true;
};

const success = () => {
	emit('refresh');
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
