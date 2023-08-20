<template>
	<div>
		<div class="relative flex items-center justify-center file-item" :style="{ height: fileSize, width: fileSize }">
			<el-image class="image" v-if="type === 'image'" fit="contain" :src="uri"></el-image>
			<video class="video" v-else-if="type === 'video'" :src="uri"></video>
			<div
				v-if="type == 'video'"
				class="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] rounded-full w-5 h-5 flex justify-center items-center bg-[rgba(0,0,0,0.3)]"
			>
				<el-icon><CaretRight /></el-icon>
			</div>

			<div v-if="type === 'file'" class="flex items-center justify-center">
				<img class="w-16" :src="getFileImage(uri)" />
			</div>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import txt from '/@/assets/txt.png';
import word from '/@/assets/word.png';
import excel from '/@/assets/excel.png';
import pdf from '/@/assets/pdf.png';
import ppt from '/@/assets/ppt.png';
import folder from '/@/assets/icon_folder.png';

export default defineComponent({
	props: {
		// 图片地址
		uri: {
			type: String,
		},
		// 图片尺寸
		fileSize: {
			type: String,
			default: '100px',
		},
		// 文件类型
		type: {
			type: String,
			default: 'image',
		},
	},
	emits: ['close'],
	methods: {
		getFileImage(uri?: string) {
			if (uri?.includes('txt')) {
				return txt;
			}

			if (uri?.includes('xls')) {
				return excel;
			}

			if (uri?.includes('doc')) {
				return word;
			}

			if (uri?.includes('pdf')) {
				return pdf;
			}

			if (uri?.includes('ppt')) {
				return ppt;
			}

			return folder;
		},
	},
});
</script>

<style scoped lang="scss">
.file-item {
	box-sizing: border-box;
	position: relative;
	border-radius: 4px;
	overflow: hidden;
	@apply bg-br-extra-light border border-br-extra-light;
	.image,
	.video {
		display: block;
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}
}
</style>
