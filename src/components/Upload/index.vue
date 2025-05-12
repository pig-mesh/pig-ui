<!--文件上传组件-->
<template>
	<div class="w-full upload-file">
		<!-- 当禁用时只显示文件列表，不使用el-upload组件 -->
		<div v-if="props.disabled">
			<div v-if="fileList.length === 0" class="flex justify-center items-center px-4 text-gray-400 bg-gray-50 rounded-md p">
				<el-icon class="mr-2 text-lg"><Document /></el-icon>
				<span class="text-sm">{{ $t('excel.noFiles') }}</span>
			</div>
			<div v-else>
				<div
					v-for="(file, index) in fileList"
					:key="index"
					class="flex items-center px-4 py-3 mb-1 rounded transition-colors duration-200 cursor-pointer group hover:bg-blue-50"
					@click="handlePreview(file)"
				>
					<el-icon class="mr-3 text-blue-500"><Document /></el-icon>
					<span class="flex-1 text-gray-700 truncate transition-colors duration-200 group-hover:text-blue-600">
						{{ getFileName(file) }}
					</span>
					<el-icon class="text-gray-400 transition-colors duration-200 group-hover:text-blue-500"><Download /></el-icon>
				</div>
			</div>
		</div>
		<!-- 默认上传组件 -->
		<el-upload
			ref="fileUpload"
			v-if="props.type === 'default' && !props.disabled"
			:action="baseUrl + other.adaptationUrl(props.uploadFileUrl)"
			:before-upload="handleBeforeUpload"
			:file-list="fileList"
			:headers="headers"
			:limit="limit"
			:on-error="handleUploadError"
			:on-remove="handleRemove"
			:on-preview="handlePreview"
			:on-exceed="handleExceed"
			:data="formData"
			:auto-upload="autoUpload"
			:on-success="handleUploadSuccess"
			:accept="fileAccept"
			class="upload-file-uploader"
			drag
			multiple
		>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">
				{{ $t('excel.operationNotice') }}
				<em>{{ $t('excel.clickUpload') }}</em>
			</div>
			<template #tip>
				<div class="el-upload__tip" v-if="props.isShowTip">
					{{ $t('excel.pleaseUpload') }}
					<template v-if="props.fileSize">
						{{ $t('excel.size') }} <b style="color: #f56c6c">{{ props.fileSize }}MB</b></template
					>
					<template v-if="props.fileType">
						{{ $t('excel.format') }} <b style="color: #f56c6c">{{ props.fileType.join('/') }}</b>
					</template>
					{{ $t('excel.file') }}
				</div>
			</template>
		</el-upload>
		<!-- 简单上传组件 -->
		<el-upload
			ref="fileUpload"
			v-if="props.type === 'simple' && !props.disabled"
			:action="baseUrl + other.adaptationUrl(props.uploadFileUrl)"
			:before-upload="handleBeforeUpload"
			:file-list="fileList"
			:headers="headers"
			:limit="limit"
			:auto-upload="autoUpload"
			:on-error="handleUploadError"
			:on-remove="handleRemove"
			:on-exceed="handleExceed"
			:data="formData"
			:on-success="handleUploadSuccess"
			:accept="fileAccept"
			class="upload-file-uploader"
			multiple
		>
			<el-button type="primary" link>{{ $t('excel.clickUpload') }}</el-button>
			<template #tip>
				<div class="el-upload__tip" v-if="props.isShowTip">
					{{ $t('excel.pleaseUpload') }}
					<template v-if="props.fileSize">
						{{ $t('excel.size') }} <b style="color: #f56c6c">{{ props.fileSize }}MB</b></template
					>
					<template v-if="props.fileType">
						{{ $t('excel.format') }} <b style="color: #f56c6c">{{ props.fileType.join('/') }}</b>
					</template>
					{{ $t('excel.file') }}
				</div>
			</template>
		</el-upload>
	</div>
</template>

<script setup lang="ts" name="upload-file">
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';
import { useI18n } from 'vue-i18n';
import { ref, computed, watch } from 'vue';
import { Document, Download } from '@element-plus/icons-vue';

// 定义基础URL
const baseUrl = import.meta.env.VITE_API_URL || '';

// 获取文件名
const getFileName = (file: any): string => {
	return file.url ? other.getQueryString(file.url, 'fileName') || other.getQueryString(file.url, 'originalFileName') : 'File';
};

// 根据文件类型生成accept属性值
const fileAccept = computed(() => {
	if (!props.fileType || props.fileType.length === 0) return '';

	let acceptValues: string[] = [];

	for (const ext of props.fileType) {
		if (typeof ext === 'string') {
			acceptValues.push(`.${ext}`);
		}
	}

	return acceptValues.join(',');
});

interface FileItem {
	name?: string;
	url?: string;
	uid?: number;
}

interface UploadFileItem {
	name: string;
	url: string;
	fileUrl: string;
	fileSize: number;
	fileName: string;
	fileType: string;
}

const props = defineProps({
	modelValue: [String, Array],
	// 数量限制
	limit: {
		type: Number,
		default: 5,
	},
	// 大小限制(MB)
	fileSize: {
		type: Number,
		default: 5,
	},
	fileType: {
		type: Array,
		default: () => ['png', 'jpg', 'jpeg', 'doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'xlsx', 'pptx'],
	},
	// 是否显示提示
	isShowTip: {
		type: Boolean,
		default: true,
	},
	uploadFileUrl: {
		type: String,
		default: '/admin/sys-file/upload',
	},
	type: {
		type: String,
		default: 'default',
		validator: (value: string) => {
			return ['default', 'simple'].includes(value);
		},
	},
	data: {
		type: Object,
		default: () => ({}),
	},
	dir: {
		type: String,
		default: '',
	},
	autoUpload: {
		type: Boolean,
		default: true,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(['update:modelValue', 'change']);

const number = ref(0);
const fileList = ref<FileItem[]>([]);
const uploadList = ref<UploadFileItem[]>([]);
const fileUpload = ref();
const { t } = useI18n();

// 请求头处理
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
});

// 请求参数处理
const formData = computed(() => {
	return Object.assign(props.data, { dir: props.dir });
});

// 上传前校检格式和大小
const handleBeforeUpload = (file: File) => {
	// 校检文件类型
	if (props.fileType.length) {
		const fileName = file.name.split('.');
		const fileExt = fileName[fileName.length - 1];
		const isTypeOk = props.fileType.indexOf(fileExt) >= 0;
		if (!isTypeOk) {
			useMessage().error(`${t('excel.typeErrorText')} ${props.fileType.join('/')}!`);
			return false;
		}
	}
	// 校检文件大小
	if (props.fileSize) {
		const isLt = file.size / 1024 / 1024 < props.fileSize;
		if (!isLt) {
			useMessage().error(`${t('excel.sizeErrorText')} ${props.fileSize} MB!`);
			return false;
		}
	}
	number.value++;
	return true;
};

// 上传成功回调
function handleUploadSuccess(res: any, file: any) {
	if (res.code === 0) {
		uploadList.value.push({
			name: file.name,
			url: `${res.data?.url}&originalFileName=${file.name}`,
			fileUrl: res.data?.fileName,
			fileSize: file.size,
			fileName: file.name,
			fileType: file.raw.type,
		});
		uploadedSuccessfully();
	} else {
		number.value--;
		useMessage().error(res.msg);
		fileUpload.value.handleRemove(file);
		uploadedSuccessfully();
	}
}

// 上传结束处理
const uploadedSuccessfully = () => {
	if (number.value > 0 && uploadList.value.length === number.value) {
		fileList.value = fileList.value.filter((f) => f.url !== undefined).concat(uploadList.value);
		uploadList.value = [];
		number.value = 0;
		emit('update:modelValue', listToString(fileList.value));
		emit('change', listToString(fileList.value), fileList.value);
	}
};

const handleRemove = (file: { name: string }) => {
	fileList.value = fileList.value.filter((f) => f.name !== file.name);
	emit('update:modelValue', listToString(fileList.value));
	emit('change', listToString(fileList.value));
};

const handlePreview = (file: any) => {
	other.downBlobFile(file.url, {}, file.name);
};

// 添加 handleExceed 函数
const handleExceed = () => {
	useMessage().warning(`${t('excel.uploadLimit')} ${props.limit} ${t('excel.files')}`);
};

/**
 * 将对象数组转为字符串，以逗号分隔。
 * @param list 待转换的对象数组。
 * @param separator 分隔符，默认为逗号。
 * @returns {string} 返回转换后的字符串。
 */
const listToString = (list: FileItem[], separator = ','): string => {
	let strs = '';
	separator = separator || ',';
	for (let i in list) {
		if (list[i].url) {
			strs += list[i].url + separator;
		}
	}
	return strs !== '' ? strs.substr(0, strs.length - 1) : '';
};

const handleUploadError = () => {
	useMessage().error('上传文件失败');
};

/**
 * 监听 props 中的 modelValue 值变化，更新 fileList。
 */
watch(
	() => props.modelValue,
	(val) => {
		if (val) {
			let temp = 1;
			// 首先将值转为数组
			const list = Array.isArray(val) ? val : (props.modelValue as string).split(',');
			// 然后将数组转为对象数组
			fileList.value = list.map((item: any) => {
				if (typeof item === 'string') {
					item = { name: other.getQueryString(item, 'originalFileName') || other.getQueryString(item, 'fileName'), url: item };
				}
				item.uid = item.uid || new Date().getTime() + temp++;
				return item as FileItem;
			});
		} else {
			fileList.value = [];
		}
	},
	{ deep: true, immediate: true }
);

const submit = () => {
	fileUpload.value?.submit();
};

defineExpose({
	submit,
});
</script>
