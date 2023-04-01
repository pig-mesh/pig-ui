<template>
	<el-upload
		ref="fileUpload"
		:action="actionUrl"
		:headers="headers"
		multiple
		:limit="1"
		:on-success="handleUploadSuccess"
		:file-list="fileList"
		:before-upload="beforeThumbImageUpload"
		:auto-upload="autoUpload"
		:data="uploadData"
	>
		<template #tip>
			<div class="el-upload__tip" v-if="props.type.length > 0">支持{{ props.type.join('/') }}格式，大小不超过2M</div>
		</template>
		<el-button type="primary">本地上传</el-button>
	</el-upload>
</template>

<script setup lang="ts" name="wx-file-upload">
import { Session } from '/@/utils/storage';
import { useMessage } from '/@/hooks/message';

const actionUrl = ref('/admin/wx-material/materialFileUpload');

const fileUpload = ref();

const headers = computed(() => {
	const tenantId = Session.getTenant();
	return {
		Authorization: 'Bearer ' + Session.getToken(),
		'TENANT-ID': tenantId,
	};
});
// 定义刷新表格emit
const emit = defineEmits(['success']);
const fileList = ref([]);

const props = defineProps({
	uploadData: {
		type: Object,
		default: () => {
			return {
				appId: '',
				mediaType: 'image',
				title: '',
				introduction: '',
			};
		},
	},
	autoUpload: {
		type: Boolean,
		default: true,
	},
	type: {
		type: Array,
		default: () => {
			return [];
		},
	},
});

const beforeThumbImageUpload = (file: any) => {
	let isType = true;
	if (props.type?.length > 0) {
		isType = props.type?.includes(file.type);
	}
	const isLt = file.size / 1024 / 1024 < 2;
	if (!isType) {
		useMessage().error('上传文件格式不对!');
	}
	if (!isLt) {
		useMessage().error('上传文件大小不能超过2M!!');
	}
	return isType && isLt;
};

const handleUploadSuccess = (response, file, fileList) => {
	fileList.value = [];
	emit('success', response, file, fileList);
};
const submit = () => {
	return new Promise((resolve) => {
		fileUpload.value.submit();
		resolve('');
	});
};

defineExpose({
	submit,
});
</script>

<style scoped></style>
