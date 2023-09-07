<!--文件上传组件-->
<template>
	<div class="upload-file">
		<el-upload
			ref="fileUpload"
			v-if="props.type === 'default'"
			:action="baseURL + other.adaptationUrl(props.uploadFileUrl)"
			:before-upload="handleBeforeUpload"
			:file-list="fileList"
			:headers="headers"
			:limit="limit"
			:on-error="handleUploadError"
			:on-remove="handleRemove"
			:on-preview="handlePreview"
			:data="data"
			:auto-upload="autoUpload"
			:on-success="handleUploadSuccess"
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
		<el-upload
			ref="fileUpload"
			v-if="props.type === 'simple'"
			:action="baseURL + other.adaptationUrl(props.uploadFileUrl)"
			:before-upload="handleBeforeUpload"
			:file-list="fileList"
			:headers="headers"
			:limit="limit"
			:auto-upload="autoUpload"
			:on-error="handleUploadError"
			:on-remove="handleRemove"
			:data="data"
			:on-success="handleUploadSuccess"
			class="upload-file-uploader"
			multiple
		>
			<el-button type="primary" link>{{ $t('excel.clickUpload') }}</el-button>
		</el-upload>
	</div>
</template>

<script setup lang="ts" name="upload-file">
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';
import { useI18n } from 'vue-i18n';
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
	},
	autoUpload: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['update:modelValue', 'change']);

const number = ref(0);
const fileList = ref([]) as any;
const uploadList = ref([]) as any;
const fileUpload = ref();
const { t } = useI18n();
const headers = computed(() => {
	return {
		Authorization: 'Bearer ' + Session.get('token'),
		'TENANT-ID': Session.getTenant(),
	};
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
		uploadList.value.push({ name: file.name, url: res.data.url });
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
		emit('change', listToString(fileList.value));
		emit('update:modelValue', listToString(fileList.value));
	}
};

const handleRemove = (file: any) => {
	fileList.value = fileList.value.filter((f) => !(f === file.url));
	emit('change', listToString(fileList.value));
	emit('update:modelValue', listToString(fileList.value));
};

const handlePreview = (file: any) => {
	other.downBlobFile(file.url, {}, file.name);
};

/**
 * 将对象数组转为字符串，以逗号分隔。
 * @param list 待转换的对象数组。
 * @param separator 分隔符，默认为逗号。
 * @returns {string} 返回转换后的字符串。
 */
const listToString = (list: { url: string }[], separator = ','): string => {
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
			const list = Array.isArray(val) ? val : props?.modelValue?.split(',');
			// 然后将数组转为对象数组
			fileList.value = list.map((item) => {
				if (typeof item === 'string') {
					item = { name: item, url: item };
				}
				item.uid = item.uid || new Date().getTime() + temp++;
				return item;
			});
		} else {
			fileList.value = [];
			return [];
		}
	},
	{ deep: true, immediate: true }
);

const submit = () => {
	fileUpload.value.submit();
};

defineExpose({
	submit,
});
</script>
