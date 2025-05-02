<!-- 图片上传组件, 推荐使用 ImagePlus 组件，后续将删除 Image组件-->
<template>
	<div>
		<el-upload
			multiple
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
			:file-list="fileList"
			:on-preview="handlePictureCardPreview"
			:class="{ hide: fileList.length >= limit }"
			:disabled="disabled"
		>
			<el-icon class="avatar-uploader-icon"><Plus /></el-icon>
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

		<el-image-viewer :teleported="true" v-if="imgViewVisible" @close="imgViewVisible = false" :url-list="previewImageList" />
	</div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage, ElLoading, ElImageViewer } from 'element-plus';
import Sortable from 'sortablejs';
import { Session } from '/@/utils/storage';
import { useI18n } from 'vue-i18n';

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
		default: 5,
	},
	// 文件类型, 例如['png', 'jpg', 'jpeg']
	fileType: {
		type: Array,
		default: () => ['png', 'jpg', 'jpeg'],
	},
	// 是否显示提示
	isShowTip: {
		type: Boolean,
		default: true,
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
});

const emit = defineEmits(['update:modelValue']);
const number = ref(0);
const uploadList = ref([]);
const imgViewVisible = ref(false);
const imageUpload = ref(null);
const baseURL = import.meta.env.VITE_API_URL || '';
const uploadImgUrl = computed(() => baseURL + props.action);
const fileList = ref([]);
const previewImageList = ref([]);
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
			// 首先将值转为数组
			const list = Array.isArray(val) ? val : props.modelValue.split(',');
			// 然后将数组转为对象数组
			fileList.value = list.map((item) => {
				if (typeof item === 'string') {
					item = { name: item, url: item };
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
			const element = document.querySelector('.el-upload-list');
			if (element) {
				Sortable.create(element, {
					onEnd: (evt) => {
						const movedItem = fileList.value.splice(evt.oldIndex, 1)[0];
						fileList.value.splice(evt.newIndex, 0, movedItem);
						emit('update:modelValue', listToString(fileList.value));
					},
				});
			}
		});
	}
});

// 上传前loading加载
const handleBeforeUpload = (file) => {
	let isImg = false;
	if (props.fileType.length) {
		let fileExtension = '';
		if (file.name.lastIndexOf('.') > -1) {
			fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
		}
		isImg = props.fileType.some((type) => {
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
	ElLoading.service({ text: t('uploading') });
	number.value++;
	return true;
};

// 文件个数超出
const handleExceed = () => {
	ElMessage.error(t('limitExceedError', { limit: props.limit }));
};

// 上传成功回调
const handleUploadSuccess = (res, file) => {
	if (res.code === 0) {
		uploadList.value.push({ name: res.data.fileName, url: baseURL + res.data.url });
		uploadedSuccessfully();
	} else {
		number.value--;
		ElLoading.service().close();
		ElMessage.error(t('uploadFailRetry'));
		imageUpload.value.handleRemove(file);
		uploadedSuccessfully();
	}
};

// 删除图片
const handleDelete = (file) => {
	const findex = fileList.value.map((f) => f.name).indexOf(file.name);
	if (findex > -1) {
		fileList.value.splice(findex, 1);
		emit('update:modelValue', listToString(fileList.value));
	}
};

// 上传失败
const handleUploadError = () => {
	ElMessage.error(t('uploadFail'));
	ElLoading.service().close();
};

// 上传结束处理
const uploadedSuccessfully = () => {
	if (number.value > 0 && uploadList.value.length === number.value) {
		fileList.value = fileList.value.concat(uploadList.value);
		uploadList.value = [];
		number.value = 0;
		emit('update:modelValue', listToString(fileList.value));
		ElLoading.service().close();
	}
};

// 预览
const handlePictureCardPreview = (file) => {
	previewImageList.value = [file.url];
	imgViewVisible.value = true;
};

// 对象转成指定字符串分隔
const listToString = (list, separator) => {
	let strs = '';
	separator = separator || ',';
	for (let i in list) {
		if (list[i].url) {
			strs += list[i].url + separator;
		}
	}
	return strs !== '' ? strs.substr(0, strs.length - 1) : '';
};
</script>

<style scoped>
/* 控制加号部分 */
:deep(.hide .el-upload--picture-card) {
	display: none;
}
</style>
