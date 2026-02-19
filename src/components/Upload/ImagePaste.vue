<!-- 图片上传组件，支持点击、拖拽、粘贴上传 -->
<template>
	<div class="image-paste-container" ref="containerRef">
		<el-upload
			multiple
			drag
			:action="uploadImgUrl"
			list-type="picture-card"
			:on-success="handleUploadSuccess"
			:before-upload="handleBeforeUpload"
			:data="data"
			:limit="limit"
			:on-error="handleUploadError"
			:on-exceed="handleExceed"
			ref="imageUpload"
			:on-remove="handleDelete"
			:show-file-list="true"
			:headers="headers"
			:file-list="displayFileList"
			:on-preview="handlePictureCardPreview"
			:class="{ hide: fileList.length >= limit }"
			:disabled="disabled"
		>
			<div class="upload-trigger">
				<el-icon class="upload-icon"><Plus /></el-icon>
				<span class="upload-text">{{ t('uploadText') }}</span>
			</div>
		</el-upload>

		<!-- 上传提示 -->
		<div class="upload-tip" v-if="showTip">
			<el-icon class="tip-icon"><InfoFilled /></el-icon>
			<span>
				{{ t('uploadTipPaste') }}
				<template v-if="limit <= 5">{{ t('limitTipParam', { limit }) }}</template>
				<template v-if="fileSize">{{ t('sizeLimitTipParam', { fileSize }) }}</template>
				<template v-if="fileType">{{ t('formatTipParam', { fileType: fileType.join('/') }) }}</template>
			</span>
		</div>

		<el-image-viewer :teleported="true" v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="previewImageList" />
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useElementVisibility, useEventListener } from '@vueuse/core';
import { Plus, InfoFilled } from '@element-plus/icons-vue';
import { ElMessage, ElLoading, ElImageViewer } from 'element-plus';
import { Session } from '/@/utils/storage';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const { t } = useI18n();

const props = defineProps({
	modelValue: {
		type: [String, Object, Array],
		default: '',
	},
	// 上传接口地址
	action: {
		type: String,
		default: '/admin/sys-file/upload',
	},
	// 上传携带的参数
	data: {
		type: Object,
		default: () => ({}),
	},
	// 图片数量限制
	limit: {
		type: Number,
		default: 5,
	},
	// 大小限制(MB)
	fileSize: {
		type: Number,
		default: 2,
	},
	// 文件类型, 例如['png', 'jpg', 'jpeg']
	fileType: {
		type: Array as () => string[],
		default: () => ['png', 'jpg', 'jpeg'],
	},
	// 是否显示提示
	isShowTip: {
		type: Boolean,
		default: true,
	},
	// 是否禁用
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue']);
const number = ref(0);
const uploadList = ref<Array<{ name: string; url: string }>>([]);
const imgViewVisible = ref(false);
const imageUpload = ref<any>(null);
const loadingInstance = ref<ReturnType<typeof ElLoading.service> | null>(null);
const uploadImgUrl = computed(() => baseURL + props.action);
const fileList = ref<Array<{ name: string; url: string }>>([]);
// 用于显示的文件列表，动态拼接 baseURL
const displayFileList = computed(() => {
	return fileList.value.map((item) => ({
		...item,
		url: item.url.includes('http') ? item.url : baseURL + item.url,
	}));
});
const previewImageList = ref<string[]>([]);

// 组件容器引用和可见性状态
const containerRef = ref<HTMLElement | null>(null);
const isVisible = useElementVisibility(containerRef);

const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': Session.getTenant(),
	};
});

// 是否显示提示
const showTip = computed(() => {
	return props.isShowTip && (props.fileType || props.fileSize);
});

// 监听value变化
watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			const list = Array.isArray(val) ? val : String(val).split(',');
			fileList.value = list.map((item: any) => {
				if (typeof item === 'string') {
					return { name: item, url: item };
				}
				return item;
			});
		} else {
			fileList.value = [];
		}
	},
	{ deep: true, immediate: true }
);

// 粘贴事件处理
const handlePaste = (event: ClipboardEvent) => {
	// 只在组件可见且未禁用时处理粘贴
	if (!isVisible.value || props.disabled || fileList.value.length >= props.limit) {
		return;
	}

	const items = event.clipboardData?.items;
	if (!items) return;

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		if (item.type.includes('image')) {
			const file = item.getAsFile();
			if (file && validateFile(file)) {
				uploadPastedFile(file);
			}
			event.preventDefault();
			break;
		}
	}
};

// 全局粘贴事件监听（自动在组件卸载时移除）
useEventListener(document, 'paste', handlePaste);

// 验证粘贴的文件
const validateFile = (file: File): boolean => {
	// 检查文件类型
	const fileExtension = file.type.split('/')[1] || '';
	const isValidType = props.fileType.some((type: string) => {
		return file.type.includes(type) || fileExtension.includes(type);
	});

	if (!isValidType) {
		ElMessage.error(t('invalidFormatError', { fileType: props.fileType.join('/') }));
		return false;
	}

	// 检查文件大小
	if (props.fileSize && file.size / 1024 / 1024 > props.fileSize) {
		ElMessage.error(t('sizeLimitError', { fileSize: props.fileSize }));
		return false;
	}

	// 检查数量限制
	if (fileList.value.length >= props.limit) {
		ElMessage.error(t('limitExceedError', { limit: props.limit }));
		return false;
	}

	return true;
};

// 上传粘贴的文件
const uploadPastedFile = async (file: File) => {
	const loading = ElLoading.service({ text: t('uploading') });

	try {
		const formData = new FormData();
		formData.append('file', file);

		// 添加额外参数
		if (props.data) {
			Object.keys(props.data).forEach((key) => {
				formData.append(key, props.data[key]);
			});
		}

		const response = await axios.post(uploadImgUrl.value, formData, {
			headers: {
				...headers.value,
				'Content-Type': 'multipart/form-data',
			},
		});

		if (response.data.code === 0) {
			// 如果返回的是 OSS 地址则不需要增加 baseURL
			const newFile = {
				name: response.data.data.fileName,
				url: response.data.data.url,
				uid: Date.now(),
			};
			fileList.value = [...fileList.value, newFile];
			emitUpdate();
			ElMessage.success(t('uploadSuccess') || '上传成功');
		} else {
			ElMessage.error(t('uploadFailRetry'));
		}
	} catch (error) {
		ElMessage.error(t('uploadFail'));
	} finally {
		loading.close();
	}
};

// 上传前验证
const handleBeforeUpload = (file: File) => {
	let isImg = false;
	if (props.fileType.length) {
		let fileExtension = '';
		if (file.name.lastIndexOf('.') > -1) {
			fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
		}
		isImg = props.fileType.some((type: string) => {
			if (file.type.includes(type)) return true;
			if (fileExtension && fileExtension.includes(type)) return true;
			return false;
		});
	} else {
		isImg = file.type.includes('image');
	}

	if (!isImg) {
		ElMessage.error(t('invalidFormatError', { fileType: props.fileType.join('/') }));
		return false;
	}
	if (file.name.includes(',')) {
		ElMessage.error(t('invalidFilenameError'));
		return false;
	}
	if (props.fileSize) {
		const isLt = file.size / 1024 / 1024 < props.fileSize;
		if (!isLt) {
			ElMessage.error(t('sizeLimitError', { fileSize: props.fileSize }));
			return false;
		}
	}
	loadingInstance.value = ElLoading.service({ text: t('uploading') });
	number.value++;
	return true;
};

// 文件个数超出
const handleExceed = () => {
	ElMessage.error(t('limitExceedError', { limit: props.limit }));
};

// 上传成功回调
const handleUploadSuccess = (res: any, file: any) => {
	if (res.code === 0) {
		// 如果返回的是 OSS 地址则不需要增加 baseURL
		uploadList.value.push({ name: res.data.fileName, url: res.data.url });
		uploadedSuccessfully();
	} else {
		number.value--;
		loadingInstance.value?.close();
		loadingInstance.value = null;
		ElMessage.error(t('uploadFailRetry'));
		imageUpload.value?.handleRemove(file);
		uploadedSuccessfully();
	}
};

// 删除图片
const handleDelete = (file: { name: string; url: string }) => {
	const findex = fileList.value.findIndex((f) => f.name === file.name || f.url === file.url);
	if (findex > -1) {
		fileList.value.splice(findex, 1);
		emitUpdate();
	}
};

// 上传失败
const handleUploadError = () => {
	ElMessage.error(t('uploadFail'));
	loadingInstance.value?.close();
	loadingInstance.value = null;
};

// 上传结束处理
const uploadedSuccessfully = () => {
	if (number.value > 0 && uploadList.value.length === number.value) {
		fileList.value = fileList.value.concat(uploadList.value);
		uploadList.value = [];
		number.value = 0;
		emitUpdate();
		loadingInstance.value?.close();
		loadingInstance.value = null;
	}
};

// 预览
const handlePictureCardPreview = (file: { url: string }) => {
	previewImageList.value = [file.url];
	imgViewVisible.value = true;
};

// 触发更新
const emitUpdate = () => {
	const resultString = listToString(fileList.value);
	emit('update:modelValue', resultString);
};

// 对象转成指定字符串分隔
const listToString = (list: Array<{ url: string }>, separator = ',') => {
	return list
		.filter((item) => item.url)
		.map((item) => item.url)
		.join(separator);
};
</script>

<style scoped>
.image-paste-container {
	--upload-size: 120px;
	--upload-border-radius: 8px;
	--upload-border-color: #dcdfe6;
	--upload-hover-color: var(--el-color-primary);
	--upload-bg-color: #fafafa;
	--upload-hover-bg: #f0f9ff;
}

/* 上传区域基础样式 */
:deep(.el-upload--picture-card) {
	width: var(--upload-size);
	height: var(--upload-size);
	border: 1px dashed var(--upload-border-color);
	border-radius: var(--upload-border-radius);
	background-color: var(--upload-bg-color);
	transition: all 0.3s ease;
}

:deep(.el-upload--picture-card:hover) {
	border-color: var(--upload-hover-color);
	background-color: var(--upload-hover-bg);
}

:deep(.el-upload--picture-card:hover .upload-icon) {
	color: var(--upload-hover-color);
	transform: scale(1.1);
}

:deep(.el-upload--picture-card:hover .upload-text) {
	color: var(--upload-hover-color);
}

/* 拖拽时的样式 */
:deep(.el-upload-dragger) {
	width: 100%;
	height: 100%;
	padding: 0;
	border: none;
	background: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
}

:deep(.el-upload-dragger.is-dragover) {
	background-color: var(--upload-hover-bg);
}

/* 上传触发器内容 */
.upload-trigger {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
}

.upload-icon {
	font-size: 28px;
	color: #909399;
	transition: all 0.3s ease;
}

.upload-text {
	font-size: 12px;
	color: #909399;
	transition: color 0.3s ease;
}

/* 图片列表项样式 */
:deep(.el-upload-list--picture-card .el-upload-list__item) {
	width: var(--upload-size);
	height: var(--upload-size);
	border-radius: var(--upload-border-radius);
	border: 1px solid #e4e7ed;
	overflow: hidden;
	transition: all 0.3s ease;
}

:deep(.el-upload-list--picture-card .el-upload-list__item:hover) {
	border-color: var(--upload-hover-color);
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.el-upload-list__item-thumbnail) {
	object-fit: cover;
}

/* 操作按钮样式 */
:deep(.el-upload-list__item-actions) {
	background: rgba(0, 0, 0, 0.5);
	backdrop-filter: blur(2px);
}

/* 上传提示样式 */
.upload-tip {
	display: flex;
	align-items: center;
	gap: 6px;
	margin-top: 8px;
	padding: 8px 12px;
	font-size: 12px;
	color: #909399;
	background-color: #f4f4f5;
	border-radius: 4px;
	line-height: 1.5;
}

.tip-icon {
	flex-shrink: 0;
	color: var(--el-color-primary);
}

/* 隐藏上传按钮 */
:deep(.hide .el-upload--picture-card) {
	display: none;
}

/* 禁用状态 */
:deep(.el-upload--picture-card.is-disabled) {
	cursor: not-allowed;
	opacity: 0.6;
}

:deep(.el-upload--picture-card.is-disabled:hover) {
	border-color: var(--upload-border-color);
	background-color: var(--upload-bg-color);
}

/* 暗色主题适配 */
[data-theme='dark'] .image-paste-container {
	--upload-border-color: #4c4d4f;
	--upload-bg-color: #262727;
	--upload-hover-bg: #1a3a4a;
}

[data-theme='dark'] .upload-tip {
	background-color: #262727;
	color: #a3a6ad;
}
</style>
