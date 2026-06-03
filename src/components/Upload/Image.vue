<!-- 图片上传组件, 推荐使用 ImagePlus 组件，后续将删除 Image组件-->
<template>
	<div>
		<el-upload multiple :drag="dragUpload" :action="uploadImgUrl" list-type="picture-card"
			:on-success="handleUploadSuccess" :before-upload="handleBeforeUpload" :data="data" :limit="limit"
			:on-error="handleUploadError" :on-exceed="handleExceed" ref="imageUpload" :on-remove="handleDelete"
			:show-file-list="true" :headers="headers" :file-list="displayFileList" :on-preview="handlePictureCardPreview"
			:class="{ hide: fileList.length >= limit }" :disabled="disabled">
			<slot name="empty">
				<el-icon class="avatar-uploader-icon">
					<Plus />
				</el-icon>
			</slot>
		</el-upload>

		<!-- 上传提示 -->
		<div class="el-upload__tip" v-if="showTip">
			{{ t('uploadTipPrefix') }}
			<template v-if="fileSize">
				{{ t('sizeLimitTip') }} <b style="color: #f56c6c">{{ fileSize }}MB</b>
			</template>
			<template v-if="fileType">
				{{ t('formatTip') }} <b style="color: #f56c6c">{{ fileType.join('/') }}</b>
			</template>
			{{ t('fileSuffix') }}
		</div>

		<el-image-viewer :teleported="true" v-if="imgViewVisible" @close="imgViewVisible = false"
			:url-list="previewImageList" />
	</div>
</template>

<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElLoading, ElImageViewer } from 'element-plus';
import type { UploadInstance, UploadFile, UploadRawFile } from 'element-plus';
import Sortable from 'sortablejs';
import { Session } from '/@/utils/storage';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 文件项类型
interface FileItem {
	name: string;
	url: string;
}

// 上传响应类型
interface UploadResponse {
	code: number;
	data: {
		fileName: string;
		url: string;
	};
}

const props = defineProps({
	modelValue: {
		type: [String, Object, Array] as PropType<string | FileItem | FileItem[]>,
		default: '',
	},
	// 图片地址，用于向下兼容 Image 组件
	imageUrl: {
		type: String,
		default: '',
	},
	// 上传接口地址
	action: {
		type: String,
		default: '/admin/sys-file/upload',
	},
	// 上传携带的参数
	data: {
		type: Object as PropType<Record<string, unknown>>,
		default: () => ({}),
	},
	// 图片数量限制
	limit: {
		type: Number,
		default: 1,
	},
	// 大小限制(MB)
	fileSize: {
		type: Number,
		default: 5,
	},
	// 文件类型, 例如['png', 'jpg', 'jpeg']
	fileType: {
		type: Array as PropType<string[]>,
		default: () => ['png', 'jpg', 'jpeg'],
	},
	// 是否显示提示
	isShowTip: {
		type: Boolean,
		default: false,
	},
	// 拖动排序
	drag: {
		type: Boolean,
		default: true,
	},
	// 是否禁用
	disabled: {
		type: Boolean,
		default: false,
	},
	// 组件宽度
	width: {
		type: String,
		default: '150px',
	},
	// 组件高度
	height: {
		type: String,
		default: '150px',
	},
	// 组件边框圆角
	borderRadius: {
		type: String,
		default: '8px',
	},
	// 图标大小
	iconSize: {
		type: Number,
		default: undefined,
	},
	// 拖拽上传（区别于 drag 拖拽排序）
	dragUpload: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['update:modelValue', 'update:imageUrl']);
const number = ref(0);
const uploadList = ref<FileItem[]>([]);
const imgViewVisible = ref(false);
const imageUpload = ref<UploadInstance | null>(null);
const loadingInstance = ref<ReturnType<typeof ElLoading.service> | null>(null);
const uploadImgUrl = computed(() => baseURL + props.action);
const fileList = ref<FileItem[]>([]);
// 用于显示的文件列表，动态拼接 baseURL
const displayFileList = computed(() => {
	return fileList.value.map((item) => ({
		...item,
		url: item.url.includes('http') ? item.url : baseURL + item.url,
	}));
});
const previewImageList = ref<string[]>([]);
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.getToken(),
	};
});

// 是否显示提示
const showTip = computed(() => {
	return props.isShowTip && (props.fileType || props.fileSize);
});

// 监听value变化
watch(
	() => [props.modelValue, props.imageUrl],
	([modelVal, imageVal]) => {
		// 优先使用 modelValue，如果没有则使用 imageUrl
		const val = modelVal || imageVal;
		if (val) {
			// 首先将值转为数组
			const list = Array.isArray(val) ? val : (val as string).split(',');
			// 然后将数组转为对象数组
			fileList.value = list.map((item: string | FileItem) => {
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

// 拖拽排序
onMounted(() => {
	if (props.drag) {
		nextTick(() => {
			const element = document.querySelector('.el-upload-list') as HTMLElement | null;
			if (element) {
				Sortable.create(element, {
					animation: 0,
					onEnd: (evt) => {
						const oldIndex = evt.oldIndex ?? 0;
						const newIndex = evt.newIndex ?? 0;
						const movedItem = fileList.value.splice(oldIndex, 1)[0];
						fileList.value.splice(newIndex, 0, movedItem);
						const resultString = listToString(fileList.value);
						emit('update:modelValue', resultString);
						emit('update:imageUrl', resultString);
					},
				});
			}
		});
	}
});

// 上传前loading加载
const handleBeforeUpload = (file: UploadRawFile) => {
	let isImg = false;
	if (props.fileType.length) {
		let fileExtension = '';
		if (file.name.lastIndexOf('.') > -1) {
			fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
		}
		isImg = props.fileType.some((type: string) => {
			if (file.type.indexOf(type) > -1) return true;
			if (fileExtension && fileExtension.indexOf(type) > -1) return true;
			return false;
		});
	} else {
		isImg = file.type.indexOf('image') > -1;
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
const handleUploadSuccess = (res: UploadResponse, file: UploadFile) => {
	if (res.code === 0) {
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
const handleDelete = (file: UploadFile) => {
	const findex = fileList.value.findIndex((f) => f.name === file.name);
	if (findex > -1) {
		fileList.value.splice(findex, 1);
		const resultString = listToString(fileList.value);
		emit('update:modelValue', resultString);
		emit('update:imageUrl', resultString);
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
		const resultString = listToString(fileList.value);
		emit('update:modelValue', resultString);
		emit('update:imageUrl', resultString);
		loadingInstance.value?.close();
		loadingInstance.value = null;
	}
};

// 预览
const handlePictureCardPreview = (file: UploadFile) => {
	const url = file.url || '';
	previewImageList.value = [url];
	imgViewVisible.value = true;
};

// 对象转成指定字符串分隔
const listToString = (list: FileItem[], separator = ','): string => {
	return list
		.filter((item) => item.url)
		.map((item) => item.url)
		.join(separator);
};
</script>

<style scoped>
/* 控制加号部分 */
:deep(.hide .el-upload--picture-card) {
	display: none;
}

/* 自定义尺寸和圆角 */
:deep(.el-upload--picture-card) {
	width: v-bind('props.width');
	height: v-bind('props.height');
	border-radius: v-bind('props.borderRadius');
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
	width: v-bind('props.width');
	height: v-bind('props.height');
	border-radius: v-bind('props.borderRadius');
	overflow: hidden;
}

:deep(.el-upload-list--picture-card .el-upload-list__item-thumbnail) {
	border-radius: v-bind('props.borderRadius');
	object-fit: cover;
	width: 100%;
	height: 100%;
}

/* 上传区域内容居中 */
:deep(.el-upload--picture-card .el-icon) {
	margin: 0;
}

:deep(.el-upload-dragger) {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	border: none;
	border-radius: v-bind('props.borderRadius');
	background: transparent;
}

/* 隐藏上传成功的绿色勾选图标 */
:deep(.el-upload-list__item-status-label) {
	display: none !important;
}

/* 禁用所有动画效果 */
:deep(.el-upload-list--picture-card) {
	--el-transition-duration: 0s;
}

:deep(.el-upload-list__item) {
	transition: none !important;
}

:deep(.el-upload-list--picture-card .el-upload-list__item-actions) {
	transition: none !important;
}

:deep(.el-upload--picture-card) {
	transition: none !important;
}

/* disabled 状态下图标居中 */
:deep(.el-upload--picture-card.is-disabled) {
	align-items: center;
	justify-content: center;
}

:deep(.el-upload--picture-card.is-disabled .el-upload-dragger) {
	align-items: center;
	justify-content: center;
}
</style>
