<!--文件上传组件-->
<template>
	<div class="upload-file">
		<el-upload
			ref="fileUpload"
			v-if="props.type === 'default'"
			:action="props.uploadFileUrl"
			:before-upload="handleBeforeUpload"
			:file-list="fileList"
			:headers="headers"
			:limit="limit"
			:on-error="handleUploadError"
			:on-remove="handleRemove"
			:data="data"
			:auto-upload="autoUpload"
			:on-success="handleUploadSuccess"
			class="upload-file-uploader"
			drag
			multiple
		>
			<i class="el-icon-upload"></i>
			<div class="el-upload__text">
				将文件拖到此处，或
				<em>点击上传</em>
			</div>
			<template #tip>
				<div class="el-upload__tip" v-if="props.isShowTip">
					请上传
					<template v-if="props.fileSize">
						大小不超过 <b style="color: #f56c6c">{{ props.fileSize }}MB</b></template
					>
					<template v-if="props.fileType">
						格式为 <b style="color: #f56c6c">{{ props.fileType.join('/') }}</b>
					</template>
					的文件
				</div>
			</template>
		</el-upload>
		<el-upload
			ref="fileUpload"
			v-if="props.type === 'simple'"
			:action="props.uploadFileUrl"
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
			<el-button type="primary" link>点击上传</el-button>
		</el-upload>
	</div>
</template>

<script setup lang="ts" name="upload-file">
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';

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

const headers = computed(() => {
	const tenantId = Session.getTenant();
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': tenantId,
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
			useMessage().error(`文件格式不正确, 请上传${props.fileType.join('/')}格式文件!`);
			return false;
		}
	}
	// 校检文件大小
	if (props.fileSize) {
		const isLt = file.size / 1024 / 1024 < props.fileSize;
		if (!isLt) {
			useMessage().error(`上传文件大小不能超过 ${props.fileSize} MB!`);
			return false;
		}
	}
	number.value++;
	return true;
};

// 上传成功回调
function handleUploadSuccess(res: any, file: any) {
	if (res.code === 0) {
		uploadList.value.push({ name: res.data.fileName, url: res.data.url });
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

// 对象转成指定字符串分隔
const listToString = (list, separator = ',') => {
	let strs = '';
	separator = separator || ',';
	for (let i in list) {
		if (list[i].url) {
			strs += list[i].url + separator;
		}
	}
	return strs != '' ? strs.substr(0, strs.length - 1) : '';
};

const handleUploadError = () => {
	useMessage().error('上传文件失败');
};

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
