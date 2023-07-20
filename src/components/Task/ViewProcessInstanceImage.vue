<template>
	<div>
		<el-dialog v-model="dialogVisible" title="查看流程图" width="80%">
			<img :src="imgBase64" class="optimized-image" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { showImage } from '/@/api/flow/task/index';

import { defineExpose } from 'vue';

const dialogVisible = ref(false);

const view = (row) => {
	showImage(row.processInstanceId).then((res) => {
		imgBase64.value = 'data:image/png;base64,' + res.data;
		dialogVisible.value = true;
	});
};
defineExpose({ view });
const imgBase64 = ref();
</script>

<style scoped lang="scss">
.optimized-image {
	width: 60%;
	display: block;
	margin: 0 auto;
}
</style>
